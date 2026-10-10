import React, { useState } from 'react';
import type { Warehouse, Destination, ScenarioResult } from '../types';
import { Sliders, Play, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SimulatorPageProps {
  warehouses: Warehouse[];
  destinations: Destination[];
  onSimulateScenario: (scenConfig: {
    fuel_cost_increase_pct: number;
    shutdown_warehouse_ids: string[];
    disabled_route_keys: string[];
    demand_increase_pct: number;
  }) => Promise<ScenarioResult>;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  warehouses,
  onSimulateScenario
}) => {
  const [fuelIncrease, setFuelIncrease] = useState<number>(10);
  const [demandSurge, setDemandSurge] = useState<number>(0);
  const [selectedShutdowns, setSelectedShutdowns] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const toggleShutdown = (id: string) => {
    if (selectedShutdowns.includes(id)) {
      setSelectedShutdowns(selectedShutdowns.filter((item) => item !== id));
    } else {
      setSelectedShutdowns([...selectedShutdowns, id]);
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await onSimulateScenario({
        fuel_cost_increase_pct: fuelIncrease,
        shutdown_warehouse_ids: selectedShutdowns,
        disabled_route_keys: [],
        demand_increase_pct: demandSurge,
      });
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result
    ? [
        { name: 'Baseline Cost', cost: result.baseline_cost },
        { name: 'Revised Cost', cost: result.revised_cost },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-6 h-6 text-[#32D5F5]" />
          <span>What-If Scenario Simulator</span>
        </h2>
        <p className="text-sm text-[#A8B3C7]">Test supply chain resilience against fuel price spikes, facility shutdowns, and demand surges.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Scenario Controls Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white pb-3 border-b border-white/10">
              Scenario Parameters
            </h3>

            {/* Fuel Price Spike Slider */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-[#A8B3C7]">Fuel Price Spike (+%)</span>
                <span className="text-[#32D5F5] font-mono">+{fuelIncrease}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={fuelIncrease}
                onChange={(e) => setFuelIncrease(parseInt(e.target.value))}
                className="w-full accent-[#32D5F5]"
              />
              <div className="flex justify-between text-[10px] text-[#A8B3C7] font-mono">
                <span>0%</span>
                <span>+20%</span>
                <span>+50%</span>
              </div>
            </div>

            {/* Demand Surge Slider */}
            <div className="space-y-2 text-xs pt-3 border-t border-white/10">
              <div className="flex justify-between font-semibold">
                <span className="text-[#A8B3C7]">Destination Demand Surge (+%)</span>
                <span className="text-[#8B5CF6] font-mono">+{demandSurge}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={demandSurge}
                onChange={(e) => setDemandSurge(parseInt(e.target.value))}
                className="w-full accent-[#8B5CF6]"
              />
            </div>

            {/* Warehouse Shutdown Checkboxes */}
            <div className="space-y-2 text-xs pt-3 border-t border-white/10">
              <label className="block text-xs font-semibold text-[#A8B3C7]">Simulate Hub Shutdowns</label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {warehouses.map((wh) => (
                  <label key={wh.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                    <span className="text-white">{wh.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedShutdowns.includes(wh.id)}
                      onChange={() => toggleShutdown(wh.id)}
                      className="w-4 h-4 accent-rose-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <button
              id="run-scenario-simulator-btn"
              onClick={handleSimulate}
              disabled={loading}
              className="w-full btn-cyan-gradient py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{loading ? 'Simulating Scenario...' : 'Simulate Scenario Impact'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Impact Results */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white">{result.scenario_name}</h3>
                  <p className="text-xs text-[#A8B3C7] mt-0.5">Perturbed optimization solution output</p>
                </div>

                <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${
                  result.cost_delta > 0
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}>
                  {result.cost_delta >= 0 ? `+${result.cost_delta_pct}% Cost Shift` : `${result.cost_delta_pct}%`}
                </span>
              </div>

              {result.unfulfilled_demand > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
                  <div>
                    <strong className="block font-bold">Unfulfilled Demand Alert:</strong>
                    <span>{result.unfulfilled_demand} units could not be delivered under the perturbed network state.</span>
                  </div>
                </div>
              )}

              {/* Cost Diff Cards */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#A8B3C7] block">Baseline Cost</span>
                  <span className="text-lg font-bold text-[#32D5F5]">₹{result.baseline_cost.toLocaleString()}</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#A8B3C7] block">Revised Cost</span>
                  <span className="text-lg font-bold text-rose-400">₹{result.revised_cost.toLocaleString()}</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#A8B3C7] block">Delta Difference</span>
                  <span className="text-lg font-bold text-amber-300">+₹{result.cost_delta.toLocaleString()}</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#A8B3C7" fontSize={12} />
                    <YAxis stroke="#A8B3C7" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#141E32', borderColor: 'rgba(50,213,245,0.3)', borderRadius: '8px', color: '#F5F7FF' }} />
                    <Bar dataKey="cost" fill="#32D5F5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center border border-white/10 space-y-3">
              <Sliders className="w-12 h-12 text-[#32D5F5] mx-auto opacity-50" />
              <h3 className="text-base font-bold text-white">Scenario Simulator Ready</h3>
              <p className="text-xs text-[#A8B3C7]">Adjust fuel increase, demand surge, or facility shutdowns and run the simulator.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
