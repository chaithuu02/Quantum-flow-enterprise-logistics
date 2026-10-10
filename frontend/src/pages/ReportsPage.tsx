import React, { useState } from 'react';
import { api } from '../services/api';
import { FileSpreadsheet, Download, CheckCircle2, Warehouse, MapPin, Grid, Zap, PackageCheck } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const handleDownload = (type: string, title: string) => {
    const url = api.getExportUrl(type);
    window.open(url, '_blank');
    setDownloadNotice(`Export generated: Downloaded ${title} as CSV file.`);
    setTimeout(() => setDownloadNotice(null), 4000);
  };

  const reports = [
    {
      id: 'shipment-plan',
      title: 'Next Shipment & Smart Replenishment Plan',
      description: 'Export calculated shop demand, usable stock, safety stock, required replenishment, allocations, costs, and priority statuses.',
      icon: PackageCheck,
      color: 'text-[#32D5F5]',
      borderColor: 'border-[#32D5F5]/30'
    },
    {
      id: 'warehouses',
      title: 'Warehouse Master Inventory Report',
      description: 'Export all warehouse locations, available inventories, storage capacities, and outbound limits.',
      icon: Warehouse,
      color: 'text-[#32D5F5]',
      borderColor: 'border-[#32D5F5]/30'
    },
    {
      id: 'destinations',
      title: 'Destination Fulfillment Report',
      description: 'Export target destination nodes, required demand levels, delivered quantities, and delivery priorities.',
      icon: MapPin,
      color: 'text-[#8B5CF6]',
      borderColor: 'border-[#8B5CF6]/30'
    },
    {
      id: 'matrix',
      title: 'Transportation Cost Matrix Export',
      description: 'Export complete unit transportation cost matrix (₹/unit), route capacities, and active channel toggles.',
      icon: Grid,
      color: 'text-amber-400',
      borderColor: 'border-amber-400/30'
    },
    {
      id: 'optimization',
      title: 'Optimal Shipment Solution Log',
      description: 'Export latest primal-simplex / QAOA solver output including allocated route quantities, unit rates, and totals.',
      icon: Zap,
      color: 'text-[#32D583]',
      borderColor: 'border-[#32D583]/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-[#32D583]" />
          <span>Reports & CSV Export Center</span>
        </h2>
        <p className="text-sm text-[#A8B3C7]">Generate downloadable enterprise CSV data exports for auditing and analytical reporting.</p>
      </div>

      {downloadNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => {
          const Icon = rep.icon;
          return (
            <div
              key={rep.id}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#32D5F5]/40 transition-all duration-300 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-white/5 border ${rep.borderColor} ${rep.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{rep.title}</h3>
                    <span className="text-[10px] font-mono text-[#32D5F5] uppercase">CSV FORMAT</span>
                  </div>
                </div>
                <p className="text-xs text-[#A8B3C7] leading-relaxed">{rep.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  id={`export-btn-${rep.id}`}
                  onClick={() => handleDownload(rep.id, rep.title)}
                  className="w-full btn-cyan-gradient py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {rep.id.toUpperCase()} CSV Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
