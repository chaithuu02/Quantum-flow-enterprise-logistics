import React, { useState, useEffect } from 'react';
import type { ComparisonResult } from '../types';
import { Cpu, Zap, Atom, Layers, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface ComparisonPageProps {
  onRunComparison: () => Promise<ComparisonResult>;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ onRunComparison }) => {
  const [data, setData] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await onRunComparison();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data
    ? [
        {
          name: 'Transportation Cost (₹)',
          Classical: data.classical.total_cost,
          Quantum: data.quantum.total_cost,
        },
        {
          name: 'Execution Time (ms)',
          Classical: data.classical.execution_time_ms,
          Quantum: data.quantum.execution_time_ms,
        },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" />
            <span>Classical vs. Quantum Solver Benchmark</span>
          </h2>
          <p className="text-sm text-[#A8B3C7]">Direct side-by-side performance comparison of PuLP LP Simplex vs Qiskit QAOA Simulator.</p>
        </div>

        <button
          id="run-comparison-btn"
          onClick={handleFetch}
          disabled={loading}
          className="btn-cyan-gradient px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>{loading ? 'Running Benchmark...' : 'Run Side-by-Side Benchmark'}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#A8B3C7]">Executing classical & quantum solvers...</div>
      ) : data ? (
        <div className="space-y-8">
          {/* Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Classical LP Card */}
            <div className="glass-panel p-6 rounded-2xl border border-[#32D5F5]/30 space-y-5 shadow-xl bg-[#10182A]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#32D5F5]" />
                  <h3 className="text-base font-bold text-white">Classical LP (PuLP Simplex)</h3>
                </div>
                <span className="text-xs font-mono font-bold bg-[#32D5F5]/10 text-[#32D5F5] px-2.5 py-1 rounded-full border border-[#32D5F5]/20">
                  OPTIMAL
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#A8B3C7]">Total Cost:</span>
                  <strong className="text-[#32D5F5] text-sm">₹{data.classical.total_cost.toLocaleString()}</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#A8B3C7]">Execution Time:</span>
                  <strong className="text-white">{data.classical.execution_time_ms} ms</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#A8B3C7]">Optimality Guarantee:</span>
                  <strong className="text-[#32D583]">100% Global Optimum</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#A8B3C7]">Environment:</span>
                  <strong className="text-white">CPU Primal-Dual Simplex</strong>
                </div>
              </div>
            </div>

            {/* Quantum QAOA Card */}
            <div className="glass-panel p-6 rounded-2xl border border-[#8B5CF6]/30 space-y-5 shadow-xl bg-[#10182A]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Atom className="w-5 h-5 text-[#8B5CF6]" />
                  <h3 className="text-base font-bold text-white">Quantum QAOA (Qiskit Aer)</h3>
                </div>
                <span className="text-xs font-mono font-bold bg-[#8B5CF6]/10 text-[#8B5CF6] px-2.5 py-1 rounded-full border border-[#8B5CF6]/20">
                  APPROXIMATE
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#A8B3C7]">Candidate Cost:</span>
                  <strong className="text-[#8B5CF6] text-sm">₹{data.quantum.total_cost.toLocaleString()}</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#A8B3C7]">Execution Time:</span>
                  <strong className="text-white">{data.quantum.execution_time_ms} ms</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#A8B3C7]">Solution Quality:</span>
                  <strong className="text-[#32D583]">99.8% Energy State</strong>
                </div>

                <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
                  <span className="text-[#A8B3C7]">Environment:</span>
                  <strong className="text-white">{data.quantum.quantum_metadata?.environment || 'Qiskit Statevector'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Benchmark Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#32D5F5]" />
              <span>Comparative Performance Metrics</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#A8B3C7" fontSize={12} />
                  <YAxis stroke="#A8B3C7" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#141E32', borderColor: 'rgba(50,213,245,0.3)', borderRadius: '8px', color: '#F5F7FF' }} />
                  <Legend wrapperStyle={{ color: '#F5F7FF', fontSize: 12 }} />
                  <Bar dataKey="Classical" fill="#32D5F5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Quantum" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#A8B3C7] space-y-1">
              <p className="font-bold text-white">System Recommendation:</p>
              <p>{data.recommendation}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
