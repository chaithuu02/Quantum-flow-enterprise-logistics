import type {
  OverviewData, Warehouse, Destination, MatrixEntry,
  OptimizationResult, ComparisonResult, ScenarioResult, NextShipmentPlanResult
} from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText || res.statusText}`);
  }
  return res.json();
}

export const api = {
  getOverview: (): Promise<OverviewData> => fetchJSON('/overview'),

  getWarehouses: (): Promise<Warehouse[]> => fetchJSON('/warehouses'),
  createWarehouse: (wh: Partial<Warehouse>): Promise<Warehouse> =>
    fetchJSON('/warehouses', { method: 'POST', body: JSON.stringify(wh) }),
  updateWarehouse: (id: string, wh: Partial<Warehouse>): Promise<Warehouse> =>
    fetchJSON(`/warehouses/${id}`, { method: 'PUT', body: JSON.stringify(wh) }),
  deleteWarehouse: (id: string): Promise<{ success: boolean }> =>
    fetchJSON(`/warehouses/${id}`, { method: 'DELETE' }),

  getDestinations: (): Promise<Destination[]> => fetchJSON('/destinations'),
  createDestination: (dst: Partial<Destination>): Promise<Destination> =>
    fetchJSON('/destinations', { method: 'POST', body: JSON.stringify(dst) }),
  updateDestination: (id: string, dst: Partial<Destination>): Promise<Destination> =>
    fetchJSON(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(dst) }),
  deleteDestination: (id: string): Promise<{ success: boolean }> =>
    fetchJSON(`/destinations/${id}`, { method: 'DELETE' }),

  getMatrix: (): Promise<MatrixEntry[]> => fetchJSON('/matrix'),
  updateMatrix: (entries: MatrixEntry[]): Promise<{ success: boolean }> =>
    fetchJSON('/matrix', { method: 'POST', body: JSON.stringify({ entries }) }),

  getNextShipmentPlan: (useQuantum: boolean = false): Promise<NextShipmentPlanResult> =>
    fetchJSON(`/shipment-plan?use_quantum=${useQuantum}`),

  runOptimization: (config: {
    solver: string;
    integer_shipments: boolean;
    require_full_demand: boolean;
    enforce_route_capacities: boolean;
  }): Promise<OptimizationResult | ComparisonResult> =>
    fetchJSON('/optimize', { method: 'POST', body: JSON.stringify(config) }),

  runQuantumLab: (qConfig: {
    qaoa_p_layers: number;
    shots: number;
    allow_classical_fallback: boolean;
  }): Promise<OptimizationResult> =>
    fetchJSON('/quantum-lab/run', { method: 'POST', body: JSON.stringify(qConfig) }),

  runComparison: (): Promise<ComparisonResult> =>
    fetchJSON('/compare', { method: 'POST', body: JSON.stringify({}) }),

  simulateScenario: (scenConfig: {
    fuel_cost_increase_pct: number;
    shutdown_warehouse_ids: string[];
    disabled_route_keys: string[];
    demand_increase_pct: number;
  }): Promise<ScenarioResult> =>
    fetchJSON('/simulate-scenario', { method: 'POST', body: JSON.stringify(scenConfig) }),

  resetData: (): Promise<{ success: boolean; message: string }> =>
    fetchJSON('/reset', { method: 'POST' }),

  getExportUrl: (dataType: string): string => `${API_BASE}/export/${dataType}`
};
