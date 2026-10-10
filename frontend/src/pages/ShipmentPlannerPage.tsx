import React, { useState, useEffect } from 'react';
import type { NextShipmentPlanResult } from '../types';
import { api } from '../services/api';
import {
  PackageCheck, Search, RefreshCcw, Atom,
  CheckCircle2, Info, ShieldAlert, Boxes, MapPin
} from 'lucide-react';

interface ShipmentPlannerPageProps {
  initialPlan?: NextShipmentPlanResult | null;
  onRefresh?: () => void;
}

export const ShipmentPlannerPage: React.FC<ShipmentPlannerPageProps> = ({
  initialPlan = null,
  onRefresh = () => {}
}) => {
  const [plan, setPlan] = useState<NextShipmentPlanResult | null>(initialPlan);
  const [loading, setLoading] = useState<boolean>(!initialPlan);
  const [useQuantum, setUseQuantum] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);

  useEffect(() => {
    fetchPlan();
  }, [useQuantum]);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await api.getNextShipmentPlan(useQuantum);
      setPlan(res);
      onRefresh();
    } catch (err) {
      console.error('Failed to fetch shipment plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = plan
    ? plan.items.filter((item) => {
        const matchesSearch =
          item.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.shop_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.supply_status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    : [];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Urgent':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
      case 'High Priority':
        return 'bg-amber-400/20 text-amber-300 border-amber-400/40';
      case 'Partially Fulfillable':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Insufficient Supply':
        return 'bg-red-600/30 text-red-300 border-red-500/50';
      case 'No Action':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-[#32D5F5]" />
            <span>Next Shipment Planner</span>
          </h2>
          <p className="text-sm text-[#A8B3C7]">
            Demand-Based Smart Supply Distribution & Automated Inventory Replenishment Engine.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#10182A] p-1.5 rounded-xl border border-white/10 text-xs font-mono">
            <span className="text-[#A8B3C7] px-2">Solver Engine:</span>
            <button
              onClick={() => setUseQuantum(false)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                !useQuantum ? 'bg-[#32D5F5] text-[#080B16] shadow' : 'text-[#A8B3C7] hover:text-white'
              }`}
            >
              Classical LP
            </button>
            <button
              onClick={() => setUseQuantum(true)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                useQuantum ? 'bg-[#8B5CF6] text-white shadow' : 'text-[#A8B3C7] hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>QAOA Quantum</span>
            </button>
          </div>

          <button
            onClick={fetchPlan}
            disabled={loading}
            className="btn-cyan-gradient px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalculate Plan</span>
          </button>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs text-[#A8B3C7]">Shops Needing Stock</span>
          <p className="text-2xl font-extrabold text-[#32D5F5] mt-1">
            {plan?.total_shops_requiring_replenishment || 0}
          </p>
          <span className="text-[10px] text-[#A8B3C7] font-mono">Active Shops</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs text-[#A8B3C7]">Planned Replenishment</span>
          <p className="text-2xl font-extrabold text-white mt-1">
            {plan?.total_planned_shipment_qty.toLocaleString() || 0} <span className="text-xs text-[#A8B3C7]">units</span>
          </p>
          <span className="text-[10px] text-[#32D583] font-mono">Dynamic Allocated</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs text-[#A8B3C7]">Shops at Stockout Risk</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">
            {plan?.shops_at_stockout_risk || 0}
          </p>
          <span className="text-[10px] text-amber-300 font-mono">Stock &lt; Safety Limit</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs text-[#A8B3C7]">Total Distribution Cost</span>
          <p className="text-2xl font-extrabold text-[#8B5CF6] mt-1">
            ₹{plan?.total_distribution_cost.toLocaleString() || 0}
          </p>
          <span className="text-[10px] text-[#A8B3C7] font-mono">Optimized Freight</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <span className="text-xs text-[#A8B3C7]">Unfulfilled Shortage</span>
          <p className={`text-2xl font-extrabold mt-1 ${plan && plan.total_unfulfilled_demand > 0 ? 'text-rose-400' : 'text-[#32D583]'}`}>
            {plan?.total_unfulfilled_demand || 0} <span className="text-xs">units</span>
          </p>
          <span className="text-[10px] font-mono text-[#A8B3C7]">
            {plan && plan.total_unfulfilled_demand > 0 ? 'Action Required' : '0 Deficit'}
          </span>
        </div>
      </div>

      {/* Shortage Warning Banner (Section 5) */}
      {plan && plan.total_unfulfilled_demand > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-300 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-400" />
            <span>Shortage Alert: Warehouse Supply Deficit Detected</span>
          </div>
          <p>
            Regional warehouse inventory or active route capacities are insufficient to fulfill total requested replenishment ({plan.total_unfulfilled_demand} units unfulfilled across affected shops). Consider expanding warehouse storage or activating secondary freight corridors.
          </p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-white/10">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#A8B3C7] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search shop, product, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white text-xs focus:outline-none focus:border-[#32D5F5]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-[#080B16] p-1 rounded-lg border border-white/10 text-xs">
            {['All', 'Urgent', 'High Priority', 'Normal', 'Partially Fulfillable', 'Insufficient Supply', 'No Action'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-[#32D5F5] text-[#080B16] font-bold shadow'
                    : 'text-[#A8B3C7] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-[#A8B3C7] font-mono">
          Showing <strong className="text-white">{filteredItems.length}</strong> planned shipments
        </span>
      </div>

      {/* Replenishment Items List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#A8B3C7] flex items-center justify-center gap-2">
          <RefreshCcw className="w-4 h-4 animate-spin text-[#32D5F5]" />
          <span>Calculating smart replenishment requirements...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center border border-white/10 space-y-3">
          <PackageCheck className="w-12 h-12 text-[#A8B3C7] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Planned Shipments Match Filter</h3>
          <p className="text-xs text-[#A8B3C7]">Try clearing search terms or status filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedExplanation === item.shop_id;
            return (
              <div
                key={item.shop_id}
                className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#32D5F5]/40 transition-all duration-300 space-y-4 shadow-xl"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#32D5F5]/10 border border-[#32D5F5]/30 flex items-center justify-center text-[#32D5F5]">
                      <Boxes className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{item.shop_name}</span>
                        <span className="text-xs font-mono text-[#32D5F5] font-normal">({item.product_name})</span>
                      </h3>
                      <p className="text-xs text-[#A8B3C7] flex items-center gap-1 font-mono">
                        <MapPin className="w-3 h-3 text-[#32D5F5]" />
                        <span>Delivery Deadline: {item.expected_delivery_date}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status & Priority Badges */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${getStatusBadgeStyle(item.supply_status)}`}>
                      {item.supply_status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white">
                      Priority: {item.priority}
                    </span>
                  </div>
                </div>

                {/* Stock & Replenishment Math Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-[#A8B3C7] block">Current Usable</span>
                    <span className="text-base font-bold text-white">{item.current_stock} u</span>
                  </div>

                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-[#A8B3C7] block">Forecast Demand</span>
                    <span className="text-base font-bold text-[#32D5F5]">{item.forecast_demand} u</span>
                  </div>

                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-[#A8B3C7] block">Safety Stock</span>
                    <span className="text-base font-bold text-[#8B5CF6]">{item.safety_stock} u</span>
                  </div>

                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-[#A8B3C7] block">Incoming Stock</span>
                    <span className="text-base font-bold text-amber-300">{item.incoming_stock} u</span>
                  </div>

                  <div className="bg-[#32D5F5]/10 p-2.5 rounded-xl border border-[#32D5F5]/30 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#32D5F5] block font-bold">Required Replenishment</span>
                    <span className="text-base font-extrabold text-[#32D5F5]">{item.required_replenishment} u</span>
                  </div>
                </div>

                {/* Recommended Supplier & Freight Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-xs">
                  <div className="space-y-1">
                    <span className="text-[#A8B3C7]">Supplying Hub:</span>{' '}
                    <strong className="text-white font-bold">
                      {item.supplying_warehouse_name || 'Unassigned (Stock Deficit)'}
                    </strong>
                    {item.supplying_warehouse_name && (
                      <span className="text-[#32D5F5] ml-2">(@ ₹{item.unit_transport_cost}/u)</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span>
                      Recommended Shipment:{' '}
                      <strong className="text-[#32D583] font-bold text-sm">{item.recommended_shipment} u</strong>
                    </span>
                    <span>
                      Total Route Cost:{' '}
                      <strong className="text-[#32D5F5] font-bold">₹{item.total_transport_cost.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                {/* Stockout Risk Indicator */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#A8B3C7]">Stockout Risk Index:</span>
                    <span className={`font-bold ${item.stockout_risk_pct > 50 ? 'text-rose-400' : 'text-[#32D583]'}`}>
                      {item.stockout_risk_pct}% Risk
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.stockout_risk_pct > 50 ? 'bg-rose-500' : 'bg-[#32D583]'
                      }`}
                      style={{ width: `${item.stockout_risk_pct}%` }}
                    />
                  </div>
                </div>

                {/* Explainable Recommendation Callout Box (Section 8) */}
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => setExpandedExplanation(isExpanded ? null : item.shop_id)}
                    className="text-xs text-[#32D5F5] hover:underline font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Hide Recommendation Rationale' : 'View Explainable Recommendation Rationale →'}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#10182A] border border-[#32D5F5]/30 text-xs text-[#A8B3C7] space-y-2 leading-relaxed">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#32D583]" />
                        <span>System Decision Rationale:</span>
                      </p>
                      <p>{item.explanation}</p>
                      {item.shortage_reason && (
                        <p className="text-rose-300 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                          Shortage Detail: {item.shortage_reason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
