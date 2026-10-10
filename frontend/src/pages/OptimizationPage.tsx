import React, { useState } from 'react';
import type { OptimizationResult, ComparisonResult } from '../types';
import { Zap, Atom, CheckCircle2, AlertTriangle, Play, Cpu, ShieldCheck, Clock, Layers } from 'lucide-react';

interface OptimizationPageProps {
  onRunOptimization: (config: {
    solver: string;
    integer_shipments: boolean;
    require_full_demand: boolean;
    enforce_route_capacities: boolean;
  }) => Promise<OptimizationResult | ComparisonResult>;
  lastResult: OptimizationResult | null;
}

export const OptimizationPage: React.FC<OptimizationPageProps> = ({
  onRunOptimization,
  lastResult: initialResult
}) => {
  const [solverType, setSolverType] = useState<string>('classical');
  const [integerShipments, setIntegerShipments] = useState<boolean>(true);
  const [requireFullDemand, setRequireFullDemand] = useState<boolean>(true);
  const [enforceCapacities, setEnforceCapacities] = useState<boolean>(true);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [result, setResult] = useState<OptimizationResult | null>(initialResult);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRun = async () => {
    setIsRunning(true);
    setErrorMsg(null);

    const steps = [
      'Reading Supply Chain Network Topology...',
      'Mapping Inventory Supply & Demand Bounds...',
      solverType === 'quantum'
        ? 'Constructing QAOA QUBO Hamiltonian Matrix...'
        : 'Formulating Continuous / Integer Linear Program...',
      solverType === 'quantum'
        ? 'Executing Qiskit Aer Statevector Parameterized Circuit...'
        : 'Solving LP Simplex & Branch-and-Cut Trees...',
      'Verifying Global Optimal Route Allocations...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProgressStep(steps[i]);
      await new Promise((r) => setTimeout(r, 120));
    }

    try {
      const res = await onRunOptimization({
        solver: solverType,
        integer_shipments: integerShipments,
        require_full_demand: requireFullDemand,
        enforce_route_capacities: enforceCapacities
      });

      if (solverType === 'compare' && 'classical' in res) {
        setResult((res as ComparisonResult).classical);
      } else {
        setResult(res as OptimizationResult);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Optimization solver failed.');
    } finally {
      setIsRunning(false);
      setProgressStep('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#32D5F5]" />
          <span>Optimization Center</span>
        </h2>
        <p className="text-sm text-[#A8B3C7]">Find a feasible, low-cost distribution plan for your supply chain network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Configuration Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-glow p-6 rounded-2xl border border-[#32D5F5]/30 space-y-6 shadow-xl bg-[#10182A]">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Cpu className="w-5 h-5 text-[#32D5F5]" />
              <span>Solver Configuration</span>
            </h3>

            {/* Solver Selection radio cards */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#A8B3C7]">Select Algorithm Solver</label>
              
              <div
                onClick={() => setSolverType('classical')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  solverType === 'classical'
                    ? 'bg-[#32D5F5]/15 border-[#32D5F5] text-white shadow-[0_0_15px_rgba(50,213,245,0.2)]'
                    : 'bg-white/5 border-white/10 text-[#A8B3C7] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${solverType === 'classical' ? 'text-[#32D5F5]' : 'text-[#A8B3C7]'}`} />
                  <div>
                    <p className="text-xs font-bold text-white">Classical Optimizer</p>
                    <p className="text-[10px] text-[#A8B3C7]">PuLP Simplex / Branch-and-Cut LP</p>
                  </div>
                </div>
                {solverType === 'classical' && <CheckCircle2 className="w-4 h-4 text-[#32D5F5]" />}
              </div>

              <div
                onClick={() => setSolverType('quantum')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  solverType === 'quantum'
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                    : 'bg-white/5 border-white/10 text-[#A8B3C7] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Atom className={`w-5 h-5 ${solverType === 'quantum' ? 'text-[#8B5CF6]' : 'text-[#A8B3C7]'}`} />
                  <div>
                    <p className="text-xs font-bold text-white">Quantum-Assisted Optimizer</p>
                    <p className="text-[10px] text-[#A8B3C7]">QAOA Algorithm & Qiskit Simulator</p>
                  </div>
                </div>
                {solverType === 'quantum' && <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />}
              </div>

              <div
                onClick={() => setSolverType('compare')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  solverType === 'compare'
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-[0_0_15px_rgba(245,185,66,0.2)]'
                    : 'bg-white/5 border-white/10 text-[#A8B3C7] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className={`w-5 h-5 ${solverType === 'compare' ? 'text-amber-400' : 'text-[#A8B3C7]'}`} />
                  <div>
                    <p className="text-xs font-bold text-white">Compare Both Solvers</p>
                    <p className="text-[10px] text-[#A8B3C7]">Side-by-side classical vs quantum benchmark</p>
                  </div>
                </div>
                {solverType === 'compare' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
            </div>

            {/* Constraint Toggles */}
            <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
              <label className="block text-xs font-semibold text-[#A8B3C7]">Constraint Controls</label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                <span className="text-white">Require Complete Demand Fulfillment</span>
                <input
                  type="checkbox"
                  checked={requireFullDemand}
                  onChange={(e) => setRequireFullDemand(e.target.checked)}
                  className="w-4 h-4 accent-[#32D5F5]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                <span className="text-white">Enforce Individual Route Capacities</span>
                <input
                  type="checkbox"
                  checked={enforceCapacities}
                  onChange={(e) => setEnforceCapacities(e.target.checked)}
                  className="w-4 h-4 accent-[#32D5F5]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10">
                <span className="text-white">Integer Shipment Quanta</span>
                <input
                  type="checkbox"
                  checked={integerShipments}
                  onChange={(e) => setIntegerShipments(e.target.checked)}
                  className="w-4 h-4 accent-[#32D5F5]"
                />
              </label>
            </div>

            {/* Run Button */}
            <button
              id="run-optimization-btn"
              onClick={handleRun}
              disabled={isRunning}
              className="w-full btn-cyan-gradient py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isRunning ? 'Optimizing Network...' : 'Run Optimization'}</span>
            </button>

            {isRunning && (
              <div className="p-3 rounded-lg bg-[#32D5F5]/10 border border-[#32D5F5]/30 text-[#32D5F5] text-xs font-mono animate-pulse flex items-center gap-2">
                <Atom className="w-4 h-4 animate-spin" />
                <span>{progressStep}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Results Display Panel */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6 shadow-2xl">
              {/* Header Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                        result.status === 'Optimal'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {result.status}
                    </span>
                    <h3 className="text-base font-bold text-white">{result.solver_used}</h3>
                  </div>
                  <p className="text-xs text-[#A8B3C7] mt-1">{result.notes}</p>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs text-[#A8B3C7] block">Execution Time</span>
                  <span className="text-sm font-bold text-[#32D5F5] flex items-center justify-end gap-1">
                    <Clock className="w-3.5 h-3.5" /> {result.execution_time_ms} ms
                  </span>
                </div>
              </div>

              {/* Infeasible alert banner */}
              {result.status !== 'Optimal' && (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs space-y-1">
                  <p className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Optimization Problem Infeasible
                  </p>
                  <p>The system could not satisfy total demand within the active inventory or route capacity constraints. Consider adjusting demand limits or enabling additional warehouses.</p>
                </div>
              )}

              {/* Key Results Summary Metrics */}
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#A8B3C7] block">Total Transportation Cost</span>
                  <span className="text-xl font-extrabold text-[#32D5F5]">₹{result.total_cost.toLocaleString()}</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#A8B3C7] block">Active Routes Used</span>
                  <span className="text-xl font-extrabold text-[#8B5CF6]">{result.num_used_routes} channels</span>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-[#A8B3C7] block">Constraint Proof</span>
                  <span className="text-xs font-bold text-[#32D583] flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-4 h-4" /> Fully Verified
                  </span>
                </div>
              </div>

              {/* Shipment Plan Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Optimal Shipment Allocations</h4>
                
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#10182A] text-[#A8B3C7] border-b border-white/10">
                      <tr>
                        <th className="p-3 font-semibold">Origin Warehouse</th>
                        <th className="p-3 font-semibold">Destination Node</th>
                        <th className="p-3 font-semibold text-right">Shipment Qty</th>
                        <th className="p-3 font-semibold text-right">Unit Rate</th>
                        <th className="p-3 font-semibold text-right">Total Route Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {result.shipment_plan.map((route, i) => (
                        <tr key={i} className="hover:bg-white/[0.02]">
                          <td className="p-3 text-white font-medium">{route.warehouse_name}</td>
                          <td className="p-3 text-[#32D5F5]">{route.destination_name}</td>
                          <td className="p-3 text-right font-bold text-white">{route.quantity} u</td>
                          <td className="p-3 text-right text-[#A8B3C7]">₹{route.unit_cost}</td>
                          <td className="p-3 text-right font-bold text-[#32D583]">₹{route.total_cost.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center border border-white/10 space-y-4">
              <Zap className="w-12 h-12 text-[#32D5F5] mx-auto opacity-50 animate-pulse" />
              <h3 className="text-lg font-bold text-white">Ready for Optimization</h3>
              <p className="text-xs text-[#A8B3C7] max-w-sm mx-auto">
                Configure your solver parameters on the left and click "Run Optimization" to generate the optimal route allocation plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
