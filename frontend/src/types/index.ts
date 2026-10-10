export interface Warehouse {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  inventory: number;
  capacity: number;
  outbound_capacity: number;
}

export interface Destination {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  demand: number;
  priority: 'High' | 'Medium' | 'Low';
  delivered_qty: number;
  // Smart Supply Distribution Fields
  product_name?: string;
  current_stock?: number;
  safety_stock?: number;
  incoming_stock?: number;
  historical_sales?: number;
  shop_capacity?: number;
  required_delivery_date?: string;
}

export interface MatrixEntry {
  warehouse_id: string;
  destination_id: string;
  cost_per_unit: number;
  route_capacity: number;
  active: boolean;
}

export interface ShipmentRoute {
  warehouse_id: string;
  warehouse_name: string;
  destination_id: string;
  destination_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

export interface WarehouseUtilization {
  name: string;
  inventory: number;
  shipped: number;
  remaining: number;
  utilization_pct: number;
}

export interface DestinationFulfillment {
  name: string;
  demand: number;
  received: number;
  unfulfilled: number;
  fulfillment_pct: number;
}

export interface QuantumMetadata {
  qubits: number;
  decision_variables?: number;
  circuit_depth: number;
  qaoa_p_layers: number;
  shots: number;
  hamiltonian_energy?: number;
  environment: string;
  used_fallback: boolean;
  approximation_ratio?: number;
  quantum_hardware_ready?: boolean;
}

export interface OptimizationResult {
  solver_used: string;
  status: string;
  total_cost: number;
  execution_time_ms: number;
  shipment_plan: ShipmentRoute[];
  num_used_routes: number;
  warehouse_utilization: Record<string, WarehouseUtilization>;
  destination_fulfillment: Record<string, DestinationFulfillment>;
  constraint_validation: {
    supply_satisfied: boolean;
    demand_satisfied: boolean;
    capacities_respected: boolean;
  };
  notes?: string;
  quantum_metadata?: QuantumMetadata;
}

export interface ComparisonResult {
  classical: OptimizationResult;
  quantum: OptimizationResult;
  cost_diff_pct: number;
  time_diff_ms: number;
  winning_solver: string;
  recommendation: string;
}

export interface ScenarioResult {
  scenario_name: string;
  baseline_cost: number;
  revised_cost: number;
  cost_delta: number;
  cost_delta_pct: number;
  unfulfilled_demand: number;
  baseline_shipments: ShipmentRoute[];
  scenario_shipments: ShipmentRoute[];
  affected_routes_count: number;
  status: string;
}

// -------------------------------------------------------------
// Demand-Based Smart Supply Distribution & Next Shipment Plan
// -------------------------------------------------------------

export interface ReplenishmentItem {
  shop_id: string;
  shop_name: string;
  product_name: string;
  current_stock: number;
  forecast_demand: number;
  safety_stock: number;
  incoming_stock: number;
  required_replenishment: number;
  recommended_shipment: number;
  supplying_warehouse_id?: string | null;
  supplying_warehouse_name?: string | null;
  unit_transport_cost: number;
  total_transport_cost: number;
  expected_delivery_date: string;
  priority: string;
  supply_status: string;
  stockout_risk_pct: number;
  shortage_quantity: number;
  shortage_reason?: string | null;
  explanation: string;
}

export interface NextShipmentPlanResult {
  items: ReplenishmentItem[];
  total_shops_requiring_replenishment: number;
  total_products_required: number;
  total_planned_shipment_qty: number;
  total_unfulfilled_demand: number;
  total_distribution_cost: number;
  shops_at_stockout_risk: number;
  solver_used: string;
  execution_time_ms: number;
  notes: string;
}

export interface OverviewData {
  active_warehouses: number;
  connected_destinations: number;
  available_inventory: number;
  total_warehouse_capacity: number;
  total_demand: number;
  active_shipping_routes: number;
  total_transportation_cost: number;
  optimized_cost: number;
  estimated_savings: number;
  demand_fulfillment_pct: number;
  last_optimization: OptimizationResult | null;
  // Smart Supply Telemetry
  shops_requiring_replenishment?: number;
  total_planned_shipment_qty?: number;
  shops_at_stockout_risk?: number;
  total_unfulfilled_demand?: number;
  replenishment_distribution_cost?: number;
  next_shipment_plan?: NextShipmentPlanResult | null;
}
