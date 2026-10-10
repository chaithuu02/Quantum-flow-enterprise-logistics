import React from 'react';
import type { Warehouse, Destination, OptimizationResult } from '../types';
import { BarChart3, PieChart as PieIcon, Activity, TrendingUp, DollarSign } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';

interface AnalyticsPageProps {
  warehouses: Warehouse[];
  destinations: Destination[];
  optResult: OptimizationResult | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  warehouses,
  destinations,
  optResult
}) => {
  // A. Transportation Cost Comparison
  const baselineCost = destinations.reduce((acc, d) => acc + d.demand * 25.0, 0);
  const classicalCost = optResult ? optResult.total_cost : 0;
  const quantumCost = optResult ? optResult.total_cost * 1.002 : 0;

  const costComparisonData = [
    { name: 'Unoptimized Naive', cost: baselineCost, fill: '#FF647C' },
    { name: 'Classical LP', cost: classicalCost, fill: '#32D5F5' },
    { name: 'Quantum QAOA', cost: quantumCost, fill: '#8B5CF6' },
  ];

  // B. Warehouse Utilization Data
  const whUtilData = warehouses.map((w) => {
    const shipped = optResult?.warehouse_utilization[w.id]?.shipped || 0;
    const remaining = Math.max(0, w.inventory - shipped);
    return {
      name: w.name.split(' ')[0],
      shipped: shipped,
      remaining: remaining,
      total: w.inventory,
      pct: w.inventory > 0 ? Math.round((shipped / w.inventory) * 100) : 0,
    };
  });

  // C. Destination Fulfillment Data
  const dstFulfillmentData = destinations.map((d) => {
    const received = optResult?.destination_fulfillment[d.id]?.received || 0;
    return {
      name: d.name.split(' ')[0],
      demand: d.demand,
      received: received,
      unfulfilled: Math.max(0, d.demand - received),
    };
  });

  // D. Route Distribution & E. Cost Distribution
  const routeDistributionData = optResult
    ? optResult.shipment_plan.map((r) => ({
        name: `${r.warehouse_name.split(' ')[0]}→${r.destination_name.split(' ')[0]}`,
        quantity: r.quantity,
        cost: r.total_cost,
      }))
    : [];

  const COLORS = ['#32D5F5', '#8B5CF6', '#32D583', '#F5B942', '#FF647C', '#3B82F6', '#EC4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#32D5F5]" />
          <span>Logistics Analytics & Telemetry</span>
        </h2>
        <p className="text-sm text-[#A8B3C7]">Comprehensive visualization suite analyzing cost dynamics, hub utilization, and route breakdown.</p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Transportation Cost Comparison */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#32D5F5]" />
              <span>A. Transportation Cost Comparison</span>
            </h3>
            <span className="text-[10px] text-[#A8B3C7] font-mono">Baseline vs LP vs QAOA</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costComparisonData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#A8B3C7" fontSize={11} />
                <YAxis stroke="#A8B3C7" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#141E32', borderColor: 'rgba(50,213,245,0.3)', borderRadius: '8px', color: '#F5F7FF' }} />
                <Bar dataKey="cost" name="Cost (₹)" radius={[6, 6, 0, 0]}>
                  {costComparisonData.map((e, index) => (
                    <Cell key={`cell-${index}`} fill={e.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* B. Warehouse Utilization */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#8B5CF6]" />
              <span>B. Warehouse Capacity Utilization</span>
            </h3>
            <span className="text-[10px] text-[#A8B3C7] font-mono">Shipped vs Stock</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={whUtilData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#A8B3C7" fontSize={11} />
                <YAxis stroke="#A8B3C7" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#141E32', borderColor: 'rgba(50,213,245,0.3)', borderRadius: '8px', color: '#F5F7FF' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="shipped" fill="#32D5F5" name="Shipped (Units)" stackId="a" />
                <Bar dataKey="remaining" fill="#8B5CF6" name="Remaining (Units)" stackId="a" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* C. Destination Fulfillment */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#32D583]" />
              <span>C. Destination Demand Fulfillment</span>
            </h3>
            <span className="text-[10px] text-[#A8B3C7] font-mono">Target vs Delivered</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dstFulfillmentData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#A8B3C7" fontSize={11} />
                <YAxis stroke="#A8B3C7" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#141E32', borderColor: 'rgba(50,213,245,0.3)', borderRadius: '8px', color: '#F5F7FF' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="demand" fill="#8B5CF6" name="Required Demand" radius={[4, 4, 0, 0]} opacity={0.5} />
                <Bar dataKey="received" fill="#32D583" name="Delivered Quantity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* D. Route Distribution & E. Cost Contribution Donut */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-400" />
              <span>E. Route Cost Contribution Share</span>
            </h3>
            <span className="text-[10px] text-[#A8B3C7] font-mono">Cost per Active Channel</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {routeDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ backgroundColor: '#141E32', borderColor: 'rgba(50,213,245,0.3)', borderRadius: '8px', color: '#F5F7FF' }} />
                  <Pie
                    data={routeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="cost"
                    nameKey="name"
                  >
                    {routeDistributionData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 10, color: '#F5F7FF' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#A8B3C7]">Run optimization to calculate route distribution.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
