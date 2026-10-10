import pytest
from data_store import DataStore
from solver import calculate_next_shipment_plan, solve_classical_lp, solve_quantum_qaoa
from models import Destination, Warehouse, MatrixEntry, OptimizationConfig

def test_replenishment_formula_calculation():
    # Test formula on Whitefield Smart Shop: MAX(0, 80 + 10 - 20 - 0) = 70
    store = DataStore()
    shop = store.destinations["dst-2"] # Whitefield Smart Shop
    shop.demand = 80
    shop.current_stock = 20
    shop.safety_stock = 10
    shop.incoming_stock = 0

    plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix)
    item = [i for i in plan.items if i.shop_id == "dst-2"][0]

    assert item.required_replenishment == 70
    assert "Formula: MAX(0, 80 + 10 - 20 - 0) = 70 units" in item.explanation
    assert item.recommended_shipment == 70

def test_replenishment_zero_when_stock_sufficient():
    # Test formula: MAX(0, 50 + 10 - 100 - 0) = 0
    store = DataStore()
    shop = store.destinations["dst-4"]
    shop.demand = 50
    shop.current_stock = 100
    shop.safety_stock = 10
    shop.incoming_stock = 0

    plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix)
    item = [i for i in plan.items if i.shop_id == "dst-4"][0]

    assert item.required_replenishment == 0
    assert item.supply_status == "No Action"

def test_incoming_shipment_timing():
    # Test incoming stock deduction: MAX(0, 100 + 20 - 30 - 40) = 50
    store = DataStore()
    shop = store.destinations["dst-1"]
    shop.demand = 100
    shop.safety_stock = 20
    shop.current_stock = 30
    shop.incoming_stock = 40

    plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix)
    item = [i for i in plan.items if i.shop_id == "dst-1"][0]

    assert item.required_replenishment == 50

def test_shortage_detection_when_inventory_depleted():
    store = DataStore()
    # Deplete all warehouse inventory to 10 units
    for wh in store.warehouses.values():
        wh.inventory = 10

    plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix)
    assert plan.total_unfulfilled_demand > 0
    assert plan.total_planned_shipment_qty <= 50  # 5 warehouses * 10 = 50 max
    
    # Check that shortages include explanation & reason
    shortage_items = [i for i in plan.items if i.shortage_quantity > 0]
    assert len(shortage_items) > 0
    assert shortage_items[0].shortage_reason is not None

def test_multi_shop_inventory_competition():
    store = DataStore()
    # Limit total warehouse inventory to 100 units total across all warehouses
    total_wh = list(store.warehouses.values())
    for idx, wh in enumerate(total_wh):
        wh.inventory = 20 if idx == 0 else 0

    plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix)
    assert plan.total_planned_shipment_qty <= 20
    assert plan.total_unfulfilled_demand > 0

def test_route_capacity_constraints():
    store = DataStore()
    # Deactivate or constrain all routes for dst-1
    for (w, d), entry in store.matrix.items():
        if d == "dst-1":
            entry.route_capacity = 5

    plan = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix)
    dst1_item = [i for i in plan.items if i.shop_id == "dst-1"][0]
    # Shipments to dst-1 should respect route capacity
    assert dst1_item.recommended_shipment <= 25  # 5 warehouses * 5 cap

def test_quantum_solver_replenishment_integration():
    store = DataStore()
    plan_q = calculate_next_shipment_plan(store.warehouses, store.destinations, store.matrix, use_quantum=True)
    assert plan_q.solver_used == "Quantum-Assisted QAOA"
    assert len(plan_q.items) == len(store.destinations)

def test_existing_solvers_backward_compatibility():
    store = DataStore()
    opt_c = solve_classical_lp(store.warehouses, store.destinations, store.matrix, OptimizationConfig())
    assert opt_c.status == "Optimal"
    assert opt_c.total_cost > 0

    opt_q = solve_quantum_qaoa(store.warehouses, store.destinations, store.matrix, OptimizationConfig())
    assert opt_q.status == "Optimal"
    assert opt_q.quantum_metadata is not None

if __name__ == "__main__":
    test_replenishment_formula_calculation()
    test_replenishment_zero_when_stock_sufficient()
    test_incoming_shipment_timing()
    test_shortage_detection_when_inventory_depleted()
    test_multi_shop_inventory_competition()
    test_route_capacity_constraints()
    test_quantum_solver_replenishment_integration()
    test_existing_solvers_backward_compatibility()
    print("ALL BACKEND REPLENISHMENT TESTS PASSED SUCCESSFULLY!")
