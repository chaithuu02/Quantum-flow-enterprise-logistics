import React from 'react';
import { DollarSign, CheckCircle2, TrendingDown, Percent, Route } from 'lucide-react';
import type { OverviewData } from '../types';

interface MetricCardsProps {
  overview: OverviewData | null;
  loading: boolean;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ overview, loading }) => {
  const naiveCost = overview ? overview.total_transportation_cost : 0;
  const optCost = overview ? overview.optimized_cost : 0;
  const savings = overview ? overview.estimated_savings : 0;
  const savingsPct = naiveCost > 0 ? ((savings / naiveCost) * 100).toFixed(1) : '0';
  const activeRoutes = overview?.last_optimization ? overview.last_optimization.num_used_routes : (overview?.active_shipping_routes || 0);

  const metrics = [
    {
      id: 'metric-total-cost',
      title: 'Total Unoptimized Cost',
      value: `₹${Math.round(naiveCost).toLocaleString()}`,
      subtext: 'Baseline un-routed sum',
      icon: DollarSign,
      color: 'text-rose-400',
      bgColor: 'bg-rose-400/10',
      borderColor: 'border-rose-400/20'
    },
    {
      id: 'metric-optimized-cost',
      title: 'Optimized Cost',
      value: `₹${Math.round(optCost).toLocaleString()}`,
      subtext: overview?.last_optimization ? overview.last_optimization.solver_used : 'PuLP LP Solver',
      icon: CheckCircle2,
      color: 'text-[#32D5F5]',
      bgColor: 'bg-[#32D5F5]/10',
      borderColor: 'border-[#32D5F5]/20'
    },
    {
      id: 'metric-savings',
      title: 'Potential Savings',
      value: `₹${Math.round(savings).toLocaleString()}`,
      badge: `${savingsPct}% reduction`,
      subtext: 'Compared to baseline',
      icon: TrendingDown,
      color: 'text-[#32D583]',
      bgColor: 'bg-[#32D583]/10',
      borderColor: 'border-[#32D583]/20'
    },
    {
      id: 'metric-fulfillment',
      title: 'Demand Fulfillment',
      value: `${overview ? overview.demand_fulfillment_pct : 100}%`,
      subtext: `${overview ? overview.total_demand : 0} units total demand`,
      icon: Percent,
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#8B5CF6]/10',
      borderColor: 'border-[#8B5CF6]/20'
    },
    {
      id: 'metric-active-routes',
      title: 'Active Shipping Routes',
      value: `${activeRoutes}`,
      subtext: 'Optimal supply paths',
      icon: Route,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 my-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            className="glass-panel p-4 rounded-xl border border-white/10 hover:border-[#32D5F5]/40 transition-all duration-300 shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#A8B3C7]">{m.title}</span>
              <div className={`p-2 rounded-lg ${m.bgColor} ${m.color} border ${m.borderColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {loading ? (
              <div className="h-7 w-28 bg-white/10 animate-pulse rounded" />
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white tracking-tight">{m.value}</span>
                  {m.badge && (
                    <span className="text-[10px] font-bold text-[#32D583] bg-[#32D583]/10 px-1.5 py-0.5 rounded border border-[#32D583]/20">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#A8B3C7] mt-1 font-mono truncate">{m.subtext}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
