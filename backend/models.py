from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class Warehouse(BaseModel):
    id: str
    name: str
    location: str
    lat: float
    lng: float
    inventory: int
    capacity: int
    outbound_capacity: int

class Destination(BaseModel):
    id: str
    name: str
    location: str
    lat: float
    lng: float
    demand: int
    priority: str = "Medium"  # High, Medium, Low
    delivered_qty: int = 0
    # Smart Supply Distribution Fields (Backward Compatible Defaults)
    product_name: str = "Tomatoes"
    current_stock: int = 20
    safety_stock: int = 10
    incoming_stock: int = 0
    historical_sales: int = 75
    shop_capacity: int = 1000
    required_delivery_date: str = "2026-10-12"

class MatrixEntry(BaseModel):
    warehouse_id: str
    destination_id: str
    cost_per_unit: float
    route_capacity: int = 1000
    active: bool = True

class CostMatrixUpdate(BaseModel):
    entries: List[MatrixEntry]

class OptimizationConfig(BaseModel):
    dataset: str = "default"
    solver: str = "classical"  # classical, quantum, compare
    objective: str = "min_cost"
    require_full_demand: bool = True
    enforce_route_capacities: bool = True
    integer_shipments: bool = True

class QuantumConfig(BaseModel):
    qaoa_p_layers: int = 2
    shots: int = 1024
    optimizer_maxiter: int = 50
    allow_classical_fallback: bool = True

class ScenarioConfig(BaseModel):
    fuel_cost_increase_pct: float = 0.0  # e.g., 20.0 for 20%
    shutdown_warehouse_ids: List[str] = []
    disabled_route_keys: List[str] = []  # format "wh_id->dst_id"
    demand_increase_pct: float = 0.0

class ShipmentRoute(BaseModel):
    warehouse_id: str
    warehouse_name: str
    destination_id: str
    destination_name: str
    quantity: float
    unit_cost: float
    total_cost: float

class OptimizationResult(BaseModel):
    solver_used: str  # "Classical Linear Program (PuLP)", "Quantum-Assisted QAOA (Qiskit)", "Comparison"
    status: str       # "Optimal", "Feasible", "Infeasible"
    total_cost: float
    execution_time_ms: float
    shipment_plan: List[ShipmentRoute]
    num_used_routes: int
    warehouse_utilization: Dict[str, Dict[str, Any]]
    destination_fulfillment: Dict[str, Dict[str, Any]]
    constraint_validation: Dict[str, bool]
    notes: Optional[str] = None
    quantum_metadata: Optional[Dict[str, Any]] = None

class ComparisonResult(BaseModel):
    classical: OptimizationResult
    quantum: OptimizationResult
    cost_diff_pct: float
    time_diff_ms: float
    winning_solver: str
    recommendation: str

class ScenarioResult(BaseModel):
    scenario_name: str
    baseline_cost: float
    revised_cost: float
    cost_delta: float
    cost_delta_pct: float
    unfulfilled_demand: float
    baseline_shipments: List[ShipmentRoute]
    scenario_shipments: List[ShipmentRoute]
    affected_routes_count: int
    status: str

# -------------------------------------------------------------
# Demand-Based Smart Supply Distribution & Next Shipment Plan
# -------------------------------------------------------------

class ReplenishmentItem(BaseModel):
    shop_id: str
    shop_name: str
    product_name: str
    current_stock: int
    forecast_demand: int
    safety_stock: int
    incoming_stock: int
    required_replenishment: int
    recommended_shipment: int
    supplying_warehouse_id: Optional[str] = None
    supplying_warehouse_name: Optional[str] = None
    unit_transport_cost: float = 0.0
    total_transport_cost: float = 0.0
    expected_delivery_date: str
    priority: str
    supply_status: str  # Urgent, High Priority, Normal, No Action, Partially Fulfillable, Insufficient Supply
    stockout_risk_pct: float
    shortage_quantity: int = 0
    shortage_reason: Optional[str] = None
    explanation: str

class NextShipmentPlanResult(BaseModel):
    items: List[ReplenishmentItem]
    total_shops_requiring_replenishment: int
    total_products_required: int
    total_planned_shipment_qty: int
    total_unfulfilled_demand: int
    total_distribution_cost: float
    shops_at_stockout_risk: int
    solver_used: str
    execution_time_ms: float
    notes: str
