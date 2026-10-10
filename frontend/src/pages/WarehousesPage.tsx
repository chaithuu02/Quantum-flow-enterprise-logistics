import React, { useState } from 'react';
import type { Warehouse } from '../types';
import { Warehouse as WhIcon, Plus, Search, Edit, Trash2, MapPin, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface WarehousesPageProps {
  warehouses: Warehouse[];
  loading: boolean;
  onRefresh: () => void;
  onCreate: (wh: Partial<Warehouse>) => Promise<void>;
  onUpdate: (id: string, wh: Partial<Warehouse>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const WarehousesPage: React.FC<WarehousesPageProps> = ({
  warehouses,
  loading,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWh, setEditingWh] = useState<Warehouse | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    lat: 17.3850,
    lng: 78.4867,
    inventory: 1000,
    capacity: 1500,
    outbound_capacity: 800
  });

  const [formError, setFormError] = useState('');

  const filtered = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingWh(null);
    setFormData({
      id: `wh-${Date.now().toString().slice(-4)}`,
      name: '',
      location: '',
      lat: 17.3850,
      lng: 78.4867,
      inventory: 1000,
      capacity: 1500,
      outbound_capacity: 850
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (wh: Warehouse) => {
    setEditingWh(wh);
    setFormData({ ...wh });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.location) {
      setFormError('Please enter warehouse name and location.');
      return;
    }
    if (formData.inventory < 0 || formData.capacity <= 0 || formData.outbound_capacity <= 0) {
      setFormError('Inventory, capacity, and outbound capacity must be valid positive numbers.');
      return;
    }
    if (formData.inventory > formData.capacity) {
      setFormError('Available inventory cannot exceed total storage capacity.');
      return;
    }

    try {
      if (editingWh) {
        await onUpdate(editingWh.id, formData);
      } else {
        await onCreate(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save warehouse.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this warehouse hub?')) {
      try {
        await onDelete(id);
        onRefresh();
      } catch (err: any) {
        alert(err.message || 'Failed to delete warehouse.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <WhIcon className="w-6 h-6 text-[#32D5F5]" />
            <span>Warehouse Management</span>
          </h2>
          <p className="text-sm text-[#A8B3C7]">Configure distribution centers, inventory levels, and outbound caps.</p>
        </div>

        <button
          id="add-warehouse-btn"
          onClick={handleOpenCreate}
          className="btn-cyan-gradient px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Warehouse Hub</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A8B3C7] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search warehouse name, location, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white text-xs placeholder-[#A8B3C7] focus:outline-none focus:border-[#32D5F5]"
          />
        </div>

        <div className="text-xs text-[#A8B3C7] font-mono">
          Showing <strong className="text-white">{filtered.length}</strong> of {warehouses.length} warehouse hubs
        </div>
      </div>

      {/* Warehouse Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#A8B3C7]">Loading warehouse records...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl text-center border border-white/10 space-y-3">
          <WhIcon className="w-12 h-12 text-[#A8B3C7] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Warehouses Found</h3>
          <p className="text-xs text-[#A8B3C7]">Try adjusting your search filter or create a new warehouse hub.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((wh) => {
            const utilPct = Math.min(100, Math.round((wh.inventory / wh.capacity) * 100));
            return (
              <div
                key={wh.id}
                className="glass-panel p-5 rounded-xl border border-white/10 hover:border-[#32D5F5]/40 transition-all duration-300 space-y-4 shadow-lg group relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#32D5F5]/10 border border-[#32D5F5]/30 flex items-center justify-center text-[#32D5F5] font-bold text-sm">
                      {wh.id.split('-')[1]?.toUpperCase() || 'WH'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#32D5F5] transition-colors">
                        {wh.name}
                      </h3>
                      <p className="text-xs text-[#A8B3C7] flex items-center gap-1 font-mono">
                        <MapPin className="w-3 h-3 text-[#32D5F5]" />
                        <span>{wh.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(wh)}
                      className="p-1.5 rounded text-[#A8B3C7] hover:text-[#32D5F5] hover:bg-white/5 transition-colors cursor-pointer"
                      title="Edit Warehouse"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(wh.id)}
                      className="p-1.5 rounded text-[#A8B3C7] hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                      title="Delete Warehouse"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#A8B3C7]">Storage Utilization</span>
                    <span className="text-[#32D5F5] font-bold">{utilPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#32D5F5] to-[#8B5CF6] transition-all duration-500"
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-[#A8B3C7] block">Available</span>
                    <span className="text-sm font-bold text-white">{wh.inventory.toLocaleString()}</span>
                  </div>

                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-[#A8B3C7] block">Capacity</span>
                    <span className="text-sm font-bold text-[#32D5F5]">{wh.capacity.toLocaleString()}</span>
                  </div>

                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-[#A8B3C7] block">Outbound Cap</span>
                    <span className="text-sm font-bold text-[#8B5CF6]">{wh.outbound_capacity.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#A8B3C7] font-mono flex items-center justify-between pt-1">
                  <span>GPS: {wh.lat.toFixed(4)}, {wh.lng.toFixed(4)}</span>
                  <span className="text-[#32D583] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active Hub
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-glow p-6 rounded-2xl border border-[#32D5F5]/40 space-y-5 shadow-2xl bg-[#10182A]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <WhIcon className="w-5 h-5 text-[#32D5F5]" />
                <span>{editingWh ? 'Edit Warehouse Hub' : 'Add New Warehouse Hub'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-[#A8B3C7] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A8B3C7] font-semibold mb-1">Warehouse Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hyderabad Logistics Hub"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#32D5F5]"
                />
              </div>

              <div>
                <label className="block text-[#A8B3C7] font-semibold mb-1">Location Address / Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Telangana, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#32D5F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#32D5F5]"
                  />
                </div>
                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#32D5F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Available Inventory</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.inventory}
                    onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#32D5F5]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#32D5F5]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Outbound Cap</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.outbound_capacity}
                    onChange={(e) => setFormData({ ...formData, outbound_capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#32D5F5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#A8B3C7] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-cyan-gradient px-5 py-2 rounded-lg text-xs font-bold"
                >
                  {editingWh ? 'Save Changes' : 'Create Warehouse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
