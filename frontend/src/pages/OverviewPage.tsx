import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { HeroStats } from '../components/HeroStats';
import { MetricCards } from '../components/MetricCards';
import type { OverviewData } from '../types';
import { Zap, ArrowUpRight, PackageCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface OverviewPageProps {
  overview: OverviewData | null;
  loading: boolean;
  onNavigate: (tab: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ overview, loading, onNavigate }) => {
  const optResult = overview?.last_optimization;
  const shipmentPlan = overview?.next_shipment_plan;

  const whChartData = optResult
    ? Object.entries(optResult.warehouse_utilization).map(([, item]) => ({
        name: item.name.split(' ')[0],
        shipped: item.shipped,
        remaining: item.remaining,
        utilization: item.utilization_pct,
      }))
    : [];

  const stockVsDemandData = shipmentPlan
    ? shipmentPlan.items.map((item) => ({
        name: item.shop_name.split(' ')[0],
        stock: item.current_stock,
        demand: item.forecast_demand,
        replenishment: item.required_replenishment,
      }))
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <HeroSection
        onStartOptimization={() => onNavigate('optimize')}
        onExploreQuantumLab={() => onNavigate('quantum-lab')}
      />

      {/* Hero Stats Floating Row */}
      <HeroStats overview={overview} loading={loading} />

      {/* Main Dashboard Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Supply Chain Overview</h2>
            <p className="text-sm text-[#A8B3C7]">Monitor inventory, analyze transportation costs, and optimize distribution.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('shipment-planner')}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40 flex items-center gap-1.5 cursor-pointer hover:bg-[#8B5CF6]/30"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Shipment Planner</span>
            </button>
            <button
              onClick={() => onNavigate('optimize')}
              className="btn-cyan-gradient px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Run Solver</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <MetricCards overview={overview} loading={loading} />

        {/* Smart Supply Distribution Overview Section (Section 7) */}
        <div className="glass-panel p-5 rounded-2xl border border-[#32D5F5]/30 space-y-4 bg-[#10182A]/90">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#32D5F5]" />
              <h3 className="text-base font-bold text-white">Smart Supply Distribution & Replenishment Summary</h3>
            </div>
            <button
              onClick={() => onNavigate('shipment-planner')}
              className="text-xs text-[#32D5F5] hover:underline flex items-center gap-1 font-mono cursor-pointer"
            >
              <span>View Full Next Shipment Plan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-[#A8B3C7] block">Shops Needing Replenishment</span>
              <span className="text-xl font-extrabold text-[#32D5F5]">
                {overview?.shops_requiring_replenishment ?? 0} hubs
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-[#A8B3C7] block">Planned Shipment Quantity</span>
              <span className="text-xl font-extrabold text-white">
                {overview?.total_planned_shipment_qty?.toLocaleString() ?? 0} u
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-[#A8B3C7] block">Shops at Stockout Risk</span>
              <span className="text-xl font-extrabold text-amber-400">
                {overview?.shops_at_stockout_risk ?? 0} shops
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] text-[#A8B3C7] block">Planned Freight Cost</span>
              <span className="text-xl font-extrabold text-[#8B5CF6]">
                ₹{overview?.replenishment_distribution_cost?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>

          {/* Current Stock vs Forecast Demand Chart */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-white mb-2 font-mono">Shop Stock vs. Forecast Demand Comparison</h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockVsDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#A8B3C7" fontSize={11} />
                  <YAxis stroke="#A8B3C7" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#141E32', borderColor: 'rgba(50,213,245,0.3)', borderRadius: '8px', color: '#F5F7FF' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="stock" fill="#8B5CF6" name="Current Stock" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Bar dataKey="demand" fill="#32D5F5" name="Forecast Demand" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="replenishment" fill="#32D583" name="Required Replenishment" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Analytics & Active Shipment Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick Warehouse Allocation Chart */}
          <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Warehouse Inventory Allocation</h3>
                <p className="text-xs text-[#A8B3C7]">Shipped vs Remaining Stock per Hub</p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs text-[#32D5F5] hover:underline flex items-center gap-1 font-mono cursor-pointer"
              >
                <span>Full Analytics</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center text-xs text-[#A8B3C7]">
                Loading warehouse telemetry...
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={whChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" stroke="#A8B3C7" fontSize={11} />
                    <YAxis stroke="#A8B3C7" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#141E32', borderColor: 'rgba(50,213,245,0.3)', borderRadius: '8px', color: '#F5F7FF' }}
                    />
                    <Bar dataKey="shipped" fill="#32D5F5" name="Shipped Qty (Units)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="remaining" fill="#8B5CF6" name="Remaining Inventory" radius={[4, 4, 0, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right: Active Shipment Plan Summary */}
          <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Optimal Route Allocations</h3>
                <p className="text-xs text-[#A8B3C7]">Top active shipment channels</p>
              </div>
              <span className="text-[10px] bg-[#32D583]/10 text-[#32D583] px-2 py-0.5 rounded font-mono border border-[#32D583]/20">
                {optResult ? optResult.solver_used : 'Simplex LP'}
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
              {optResult && optResult.shipment_plan.length > 0 ? (
                optResult.shipment_plan.slice(0, 5).map((route, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <span>{route.warehouse_name.split(' ')[0]}</span>
                        <span className="text-[#32D5F5]">→</span>
                        <span>{route.destination_name.split(' ')[0]}</span>
                      </p>
                      <p className="text-[10px] text-[#A8B3C7] font-mono mt-0.5">
                        {route.quantity} units @ ₹{route.unit_cost}/u
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#32D5F5]">₹{route.total_cost.toLocaleString()}</span>
                      <span className="block text-[9px] text-[#32D883] font-mono">ACTIVE</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-[#A8B3C7]">
                  No active shipment routes generated yet.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[#A8B3C7]">Total Optimal Routes: <strong>{optResult?.num_used_routes || 0}</strong></span>
              <button
                onClick={() => onNavigate('optimize')}
                className="text-[#32D5F5] hover:underline cursor-pointer"
              >
                View Full Matrix →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
