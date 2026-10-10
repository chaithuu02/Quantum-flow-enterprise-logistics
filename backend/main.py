import io
import csv
from typing import List, Dict, Optional, Any
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import (
    Warehouse, Destination, MatrixEntry, CostMatrixUpdate,
    OptimizationConfig, QuantumConfig, ScenarioConfig, OptimizationResult,
    NextShipmentPlanResult
)
from data_store import store
from solver import (
    solve_classical_lp, solve_quantum_qaoa, compare_solvers, run_scenario,
    calculate_next_shipment_plan
)

app = FastAPI(
    title="QUANTUMFLOW API",
    description="Quantum-Assisted Supply Chain Optimization Engine with Smart Replenishment Planning",
    version="2.4.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/overview")
def get_overview():
    whs = store.get_all_warehouses()
    dsts = store.get_all_destinations()
    matrix = store.get_matrix_entries()

    total_inventory = sum(w.inventory for w in whs)
    total_capacity = sum(w.capacity for w in whs)
    total_demand = sum(d.demand for d in dsts)
    active_routes_count = sum(1 for m in matrix if m.active)

    # Compute Next Shipment Plan
    shipment_plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix)
    store.last_replenishment_plan = shipment_plan

    # Initial or current optimization stats
    opt_result = store.last_optimization_result
    if opt_result is None:
        opt_result = solve_classical_lp(
            store.warehouses, store.destinations, store.matrix, OptimizationConfig()
        )
        store.last_optimization_result = opt_result

    baseline_naive_cost = sum(d.demand * 25.0 for d in dsts)
    optimized_cost = opt_result.total_cost if opt_result and opt_result.status == "Optimal" else 0.0
    estimated_savings = max(0.0, baseline_naive_cost - optimized_cost)

    return {
        "active_warehouses": len(whs),
        "connected_destinations": len(dsts),
        "available_inventory": total_inventory,
        "total_warehouse_capacity": total_capacity,
        "total_demand": total_demand,
        "active_shipping_routes": active_routes_count,
        "total_transportation_cost": baseline_naive_cost,
        "optimized_cost": optimized_cost,
        "estimated_savings": estimated_savings,
        "demand_fulfillment_pct": 100.0 if total_inventory >= total_demand else round((total_inventory / total_demand) * 100, 1),
        "last_optimization": opt_result,
        # Smart Supply Distribution Telemetry
        "shops_requiring_replenishment": shipment_plan.total_shops_requiring_replenishment,
        "total_planned_shipment_qty": shipment_plan.total_planned_shipment_qty,
        "shops_at_stockout_risk": shipment_plan.shops_at_stockout_risk,
        "total_unfulfilled_demand": shipment_plan.total_unfulfilled_demand,
        "replenishment_distribution_cost": shipment_plan.total_distribution_cost,
        "next_shipment_plan": shipment_plan
    }

# ------------------------------
# Warehouse Endpoints
# ------------------------------

@app.get("/api/warehouses", response_model=List[Warehouse])
def list_warehouses():
    return store.get_all_warehouses()

@app.post("/api/warehouses", response_model=Warehouse)
def create_warehouse(wh: Warehouse):
    if wh.id in store.warehouses:
        raise HTTPException(status_code=400, detail="Warehouse ID already exists.")
    store.update_warehouse(wh)
    for dst in store.destinations.values():
        pair = (wh.id, dst.id)
        if pair not in store.matrix:
            store.matrix[pair] = MatrixEntry(
                warehouse_id=wh.id,
                destination_id=dst.id,
                cost_per_unit=15.0,
                route_capacity=500,
                active=True
            )
    return wh

@app.put("/api/warehouses/{wh_id}", response_model=Warehouse)
def update_warehouse(wh_id: str, wh: Warehouse):
    if wh_id not in store.warehouses:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    wh.id = wh_id
    store.update_warehouse(wh)
    return wh

@app.delete("/api/warehouses/{wh_id}")
def delete_warehouse(wh_id: str):
    if wh_id not in store.warehouses:
        raise HTTPException(status_code=404, detail="Warehouse not found.")
    store.delete_warehouse(wh_id)
    return {"success": True, "message": f"Warehouse {wh_id} deleted."}

# ------------------------------
# Destination Endpoints (Shops)
# ------------------------------

@app.get("/api/destinations", response_model=List[Destination])
def list_destinations():
    return store.get_all_destinations()

@app.post("/api/destinations", response_model=Destination)
def create_destination(dst: Destination):
    if dst.id in store.destinations:
        raise HTTPException(status_code=400, detail="Destination ID already exists.")
    store.update_destination(dst)
    for wh in store.warehouses.values():
        pair = (wh.id, dst.id)
        if pair not in store.matrix:
            store.matrix[pair] = MatrixEntry(
                warehouse_id=wh.id,
                destination_id=dst.id,
                cost_per_unit=15.0,
                route_capacity=500,
                active=True
            )
    return dst

@app.put("/api/destinations/{dst_id}", response_model=Destination)
def update_destination(dst_id: str, dst: Destination):
    if dst_id not in store.destinations:
        raise HTTPException(status_code=404, detail="Destination not found.")
    dst.id = dst_id
    store.update_destination(dst)
    return dst

@app.delete("/api/destinations/{dst_id}")
def delete_destination(dst_id: str):
    if dst_id not in store.destinations:
        raise HTTPException(status_code=404, detail="Destination not found.")
    store.delete_destination(dst_id)
    return {"success": True, "message": f"Destination {dst_id} deleted."}

# ------------------------------
# Transportation Matrix Endpoints
# ------------------------------

@app.get("/api/matrix", response_model=List[MatrixEntry])
def get_matrix():
    return store.get_matrix_entries()

@app.post("/api/matrix")
def update_matrix(data: CostMatrixUpdate):
    store.update_matrix(data.entries)
    return {"success": True, "updated_count": len(data.entries)}

# ------------------------------------------------------------------
# Demand-Based Smart Supply Distribution & Next Shipment Plan API
# ------------------------------------------------------------------

@app.get("/api/shipment-plan", response_model=NextShipmentPlanResult)
def get_next_shipment_plan(use_quantum: bool = False):
    plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix, use_quantum=use_quantum)
    store.last_replenishment_plan = plan
    return plan

# ------------------------------
# Optimization & Solver Endpoints
# ------------------------------

@app.post("/api/optimize")
def run_optimization(config: OptimizationConfig = OptimizationConfig()):
    if config.solver == "classical":
        res = solve_classical_lp(store.warehouses, store.destinations, store.matrix, config)
    elif config.solver == "quantum":
        res = solve_quantum_qaoa(store.warehouses, store.destinations, store.matrix, config)
    elif config.solver == "compare":
        res = compare_solvers(store.warehouses, store.destinations, store.matrix, config)
        store.last_optimization_result = res.classical
        return res
    else:
        raise HTTPException(status_code=400, detail="Invalid solver specified.")

    store.last_optimization_result = res
    return res

@app.post("/api/quantum-lab/run")
def run_quantum_lab(q_config: QuantumConfig = QuantumConfig()):
    opt_config = OptimizationConfig(solver="quantum")
    res = solve_quantum_qaoa(
        store.warehouses, store.destinations, store.matrix, opt_config, q_config
    )
    store.last_optimization_result = res
    return res

@app.post("/api/compare")
def run_comparison(config: OptimizationConfig = OptimizationConfig()):
    res = compare_solvers(store.warehouses, store.destinations, store.matrix, config)
    return res

@app.post("/api/simulate-scenario")
def simulate_scenario(scen_config: ScenarioConfig):
    res = run_scenario(store.warehouses, store.destinations, store.matrix, scen_config)
    return res

@app.post("/api/reset")
def reset_dataset():
    store.reset_to_default()
    opt_result = solve_classical_lp(
        store.warehouses, store.destinations, store.matrix, OptimizationConfig()
    )
    store.last_optimization_result = opt_result
    return {"success": True, "message": "Dataset reset to seed enterprise defaults."}

# ------------------------------
# Export Endpoints (CSV)
# ------------------------------

@app.get("/api/export/{data_type}")
def export_data(data_type: str):
    output = io.StringIO()
    writer = csv.writer(output)

    if data_type == "warehouses":
        writer.writerow(["ID", "Name", "Location", "Latitude", "Longitude", "Inventory", "Capacity", "Outbound Capacity"])
        for w in store.get_all_warehouses():
            writer.writerow([w.id, w.name, w.location, w.lat, w.lng, w.inventory, w.capacity, w.outbound_capacity])
        filename = "quantumflow_warehouses.csv"

    elif data_type == "destinations":
        writer.writerow(["ID", "Shop Name", "Location", "Latitude", "Longitude", "Product", "Current Stock", "Forecast Demand", "Safety Stock", "Incoming Stock", "Delivery Priority", "Required Delivery Date"])
        for d in store.get_all_destinations():
            writer.writerow([d.id, d.name, d.location, d.lat, d.lng, d.product_name, d.current_stock, d.demand, d.safety_stock, d.incoming_stock, d.priority, d.required_delivery_date])
        filename = "quantumflow_shops_destinations.csv"

    elif data_type == "matrix":
        writer.writerow(["Warehouse ID", "Warehouse Name", "Destination ID", "Destination Name", "Cost Per Unit (INR)", "Route Capacity", "Active"])
        for entry in store.get_matrix_entries():
            w_name = store.warehouses[entry.warehouse_id].name if entry.warehouse_id in store.warehouses else entry.warehouse_id
            d_name = store.destinations[entry.destination_id].name if entry.destination_id in store.destinations else entry.destination_id
            writer.writerow([entry.warehouse_id, w_name, entry.destination_id, d_name, entry.cost_per_unit, entry.route_capacity, entry.active])
        filename = "quantumflow_transportation_matrix.csv"

    elif data_type == "shipment-plan":
        plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix)
        writer.writerow(["Shop ID", "Shop Name", "Product Name", "Current Usable Stock", "Forecast Demand", "Safety Stock", "Incoming Stock", "Required Replenishment", "Recommended Shipment", "Supplying Warehouse", "Unit Rate (INR)", "Total Route Cost (INR)", "Expected Delivery Date", "Supply Status", "Stockout Risk %", "Shortage Qty", "Shortage Reason", "Recommendation Explanation"])
        for item in plan.items:
            writer.writerow([
                item.shop_id, item.shop_name, item.product_name, item.current_stock, item.forecast_demand, item.safety_stock, item.incoming_stock,
                item.required_replenishment, item.recommended_shipment, item.supplying_warehouse_name or "N/A", item.unit_transport_cost, item.total_transport_cost,
                item.expected_delivery_date, item.supply_status, item.stockout_risk_pct, item.shortage_quantity, item.shortage_reason or "None", item.explanation
            ])
        filename = "quantumflow_next_shipment_plan.csv"

    elif data_type == "optimization":
        res = store.last_optimization_result or solve_classical_lp(store.warehouses, store.destinations, store.matrix, OptimizationConfig())
        writer.writerow(["Solver Used", res.solver_used])
        writer.writerow(["Status", res.status])
        writer.writerow(["Total Transportation Cost", res.total_cost])
        writer.writerow(["Execution Time (ms)", res.execution_time_ms])
        writer.writerow([])
        writer.writerow(["Warehouse ID", "Warehouse Name", "Destination ID", "Destination Name", "Allocated Quantity", "Unit Cost (INR)", "Total Route Cost (INR)"])
        for route in res.shipment_plan:
            writer.writerow([route.warehouse_id, route.warehouse_name, route.destination_id, route.destination_name, route.quantity, route.unit_cost, route.total_cost])
        filename = "quantumflow_optimization_results.csv"

    else:
        raise HTTPException(status_code=400, detail="Invalid export type.")

    output.seek(0)
    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
