import React from 'react';
import { Warehouse, MapPin, Boxes, TrendingDown, HelpCircle } from 'lucide-react';
import type { OverviewData } from '../types';

interface HeroStatsProps {
  overview: OverviewData | null;
  loading: boolean;
}

export const HeroStats: React.FC<HeroStatsProps> = ({ overview, loading }) => {
  const stats = [
    {
      id: 'active-warehouses',
      label: 'Active Warehouses',
      value: overview ? overview.active_warehouses : '-',
      unit: 'hubs',
      icon: Warehouse,
      color: 'text-[#32D5F5]',
      borderColor: 'border-[#32D5F5]/30',
      bgColor: 'bg-[#32D5F5]/10',
    },
    {
      id: 'connected-destinations',
      label: 'Connected Destinations',
      value: overview ? overview.connected_destinations : '-',
      unit: 'nodes',
      icon: MapPin,
      color: 'text-[#8B5CF6]',
      borderColor: 'border-[#8B5CF6]/30',
      bgColor: 'bg-[#8B5CF6]/10',
    },
    {
      id: 'available-inventory',
      label: 'Available Inventory',
      value: overview ? overview.available_inventory.toLocaleString() : '-',
      unit: 'units',
      icon: Boxes,
      color: 'text-amber-400',
      borderColor: 'border-amber-400/30',
      bgColor: 'bg-amber-400/10',
    },
    {
      id: 'estimated-savings',
      label: 'Estimated Savings',
      value: overview && overview.estimated_savings > 0
        ? `₹${Math.round(overview.estimated_savings).toLocaleString()}`
        : 'Run optimization to calculate savings.',
      unit: overview && overview.estimated_savings > 0 ? 'saved' : '',
      icon: TrendingDown,
      color: 'text-[#32D583]',
      borderColor: 'border-[#32D583]/30',
      bgColor: 'bg-[#32D583]/10',
      isTextMode: !overview || overview.estimated_savings <= 0
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-20 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="glass-panel p-4 rounded-xl border border-white/10 hover:border-[#32D5F5]/40 transition-all duration-300 hover:-translate-y-0.5 group shadow-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[#A8B3C7] tracking-wide">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color} border ${stat.borderColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {loading ? (
                <div className="h-8 w-24 bg-white/10 animate-pulse rounded my-1" />
              ) : stat.isTextMode ? (
                <div className="flex items-center gap-1.5 text-xs text-[#A8B3C7] py-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="italic">{stat.value}</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-white tracking-tight group-hover:text-[#32D5F5] transition-colors">
                    {stat.value}
                  </span>
                  {stat.unit && <span className="text-xs text-[#A8B3C7] font-mono">{stat.unit}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
