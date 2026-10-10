import React, { useState, useEffect } from 'react';
import type { Warehouse, Destination, MatrixEntry } from '../types';
import { Grid, Save, RotateCcw, CheckCircle2, Info } from 'lucide-react';

interface TransportationPageProps {
  warehouses: Warehouse[];
  destinations: Destination[];
  matrix: MatrixEntry[];
  loading: boolean;
  onRefresh: () => void;
  onSaveMatrix: (entries: MatrixEntry[]) => Promise<void>;
}

export const TransportationPage: React.FC<TransportationPageProps> = ({
  warehouses,
  destinations,
  matrix,
  onRefresh,
  onSaveMatrix
}) => {
  const [localMatrix, setLocalMatrix] = useState<Record<string, MatrixEntry>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const map: Record<string, MatrixEntry> = {};
    matrix.forEach((entry) => {
      map[`${entry.warehouse_id}->${entry.destination_id}`] = { ...entry };
    });
    setLocalMatrix(map);
  }, [matrix]);

  const handleCostChange = (whId: string, dstId: string, value: number) => {
    const key = `${whId}->${dstId}`;
    const existing = localMatrix[key] || {
      warehouse_id: whId,
      destination_id: dstId,
      cost_per_unit: 10,
      route_capacity: 500,
      active: true
    };
    setLocalMatrix({
      ...localMatrix,
      [key]: { ...existing, cost_per_unit: Math.max(0.1, value) }
    });
  };

  const handleActiveToggle = (whId: string, dstId: string) => {
    const key = `${whId}->${dstId}`;
    const existing = localMatrix[key] || {
      warehouse_id: whId,
      destination_id: dstId,
      cost_per_unit: 10,
      route_capacity: 500,
      active: true
    };
    setLocalMatrix({
      ...localMatrix,
      [key]: { ...existing, active: !existing.active }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const entries = Object.values(localMatrix);
      await onSaveMatrix(entries);
      setSaveMessage('Transportation matrix successfully updated and saved!');
      onRefresh();
    } catch (err: any) {
      setSaveMessage(err.message || 'Failed to save matrix updates.');
    } finally {
      setIsSaving(false);
    }
  };

  const costs = Object.values(localMatrix).map((e) => e.cost_per_unit);
  const minCost = costs.length > 0 ? Math.min(...costs) : 5;
  const maxCost = costs.length > 0 ? Math.max(...costs) : 30;

  const getHeatmapBg = (cost: number, active: boolean) => {
    if (!active) return 'bg-[#080B16] opacity-40';
    if (maxCost === minCost) return 'bg-[#141E32]';
    const ratio = (cost - minCost) / (maxCost - minCost);
    if (ratio < 0.3) return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
    if (ratio < 0.7) return 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300';
    return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Grid className="w-6 h-6 text-[#32D5F5]" />
            <span>Transportation Cost Matrix</span>
          </h2>
          <p className="text-sm text-[#A8B3C7]">Configure unit shipment costs (₹/unit) and route availability between hubs.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A8B3C7] hover:text-white glass-panel border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Matrix</span>
          </button>

          <button
            id="save-matrix-btn"
            onClick={handleSave}
            disabled={isSaving}
            className="btn-cyan-gradient px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Matrix...' : 'Save Cost Matrix'}</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
          saveMessage.includes('successfully')
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Matrix Legend */}
      <div className="glass-panel p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-6">
          <span className="text-[#A8B3C7]">Cost Heatmap Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/30 border border-emerald-500/50" />
            <span className="text-white">Low Cost (₹{minCost.toFixed(1)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-cyan-500/30 border border-cyan-500/50" />
            <span className="text-white">Moderate Cost</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-500/30 border border-amber-500/50" />
            <span className="text-white">High Cost (₹{maxCost.toFixed(1)})</span>
          </div>
        </div>

        <div className="text-[11px] text-[#A8B3C7] flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-[#32D5F5]" />
          <span>Click any cell to edit unit transportation cost in real time.</span>
        </div>
      </div>

      {/* Editable Matrix Data Table */}
      <div className="glass-panel rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#10182A] border-b border-white/10 text-[#A8B3C7]">
                <th className="p-4 font-bold text-white border-r border-white/10 sticky left-0 bg-[#10182A] z-10">
                  Warehouses \ Destinations
                </th>
                {destinations.map((dst) => (
                  <th key={dst.id} className="p-4 font-bold text-white text-center min-w-[140px]">
                    <div>{dst.name.split(' ')[0]}</div>
                    <span className="text-[10px] font-normal text-[#8B5CF6] block font-mono">Demand: {dst.demand}u</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {warehouses.map((wh) => (
                <tr key={wh.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 font-bold text-white border-r border-white/10 sticky left-0 bg-[#141E32] z-10 shadow-lg">
                    <div className="text-sm text-white">{wh.name}</div>
                    <span className="text-[10px] text-[#32D5F5] font-mono block">Inv: {wh.inventory}u</span>
                  </td>

                  {destinations.map((dst) => {
                    const key = `${wh.id}->${dst.id}`;
                    const entry = localMatrix[key] || {
                      warehouse_id: wh.id,
                      destination_id: dst.id,
                      cost_per_unit: 10,
                      route_capacity: 500,
                      active: true
                    };
                    const bgClass = getHeatmapBg(entry.cost_per_unit, entry.active);

                    return (
                      <td key={dst.id} className="p-3 text-center border-r border-white/5">
                        <div className={`p-2.5 rounded-xl border ${bgClass} transition-all space-y-1.5`}>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[#A8B3C7]">Unit Cost</span>
                            <button
                              onClick={() => handleActiveToggle(wh.id, dst.id)}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                entry.active
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {entry.active ? 'ON' : 'OFF'}
                            </button>
                          </div>

                          <div className="flex items-center justify-center gap-1 font-mono">
                            <span className="text-xs text-[#A8B3C7]">₹</span>
                            <input
                              type="number"
                              step="0.5"
                              min="0.1"
                              disabled={!entry.active}
                              value={entry.cost_per_unit}
                              onChange={(e) => handleCostChange(wh.id, dst.id, parseFloat(e.target.value) || 0)}
                              className="w-16 px-1.5 py-1 text-center rounded bg-[#080B16] border border-white/10 text-white font-bold text-xs focus:outline-none focus:border-[#32D5F5] disabled:opacity-30"
                            />
                          </div>

                          <div className="text-[9px] text-[#A8B3C7] font-mono">
                            Cap: {entry.route_capacity}u
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
