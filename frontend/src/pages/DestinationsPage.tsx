import React, { useState } from 'react';
import type { Destination } from '../types';
import { MapPin, Plus, Search, Edit, Trash2, X, ShieldAlert } from 'lucide-react';

interface DestinationsPageProps {
  destinations: Destination[];
  loading: boolean;
  onRefresh: () => void;
  onCreate: (dst: Partial<Destination>) => Promise<void>;
  onUpdate: (id: string, dst: Partial<Destination>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({
  destinations,
  loading,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDst, setEditingDst] = useState<Destination | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    lat: 18.5204,
    lng: 73.8567,
    demand: 500,
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    delivered_qty: 0,
    product_name: 'Tomatoes',
    current_stock: 20,
    safety_stock: 10,
    incoming_stock: 0,
    historical_sales: 75,
    shop_capacity: 1000,
    required_delivery_date: '2026-10-12'
  });

  const [formError, setFormError] = useState('');

  const filtered = destinations.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.product_name && d.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = priorityFilter === 'All' || d.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleOpenCreate = () => {
    setEditingDst(null);
    setFormData({
      id: `dst-${Date.now().toString().slice(-4)}`,
      name: '',
      location: '',
      lat: 18.5204,
      lng: 73.8567,
      demand: 500,
      priority: 'Medium',
      delivered_qty: 0,
      product_name: 'Tomatoes',
      current_stock: 20,
      safety_stock: 10,
      incoming_stock: 0,
      historical_sales: 75,
      shop_capacity: 1000,
      required_delivery_date: '2026-10-12'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dst: Destination) => {
    setEditingDst(dst);
    setFormData({
      id: dst.id,
      name: dst.name,
      location: dst.location,
      lat: dst.lat,
      lng: dst.lng,
      demand: dst.demand,
      priority: dst.priority,
      delivered_qty: dst.delivered_qty,
      product_name: dst.product_name || 'Tomatoes',
      current_stock: dst.current_stock ?? 20,
      safety_stock: dst.safety_stock ?? 10,
      incoming_stock: dst.incoming_stock ?? 0,
      historical_sales: dst.historical_sales ?? 75,
      shop_capacity: dst.shop_capacity ?? 1000,
      required_delivery_date: dst.required_delivery_date || '2026-10-12'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.location) {
      setFormError('Please provide destination name and location.');
      return;
    }
    if (formData.demand <= 0) {
      setFormError('Required demand must be greater than 0.');
      return;
    }

    try {
      if (editingDst) {
        await onUpdate(editingDst.id, formData);
      } else {
        await onCreate(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save destination.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this destination center?')) {
      try {
        await onDelete(id);
        onRefresh();
      } catch (err: any) {
        alert(err.message || 'Failed to delete destination.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#8B5CF6]" />
            <span>Destination Management</span>
          </h2>
          <p className="text-sm text-[#A8B3C7]">Manage target fulfillment nodes, required demand quotas, and delivery priorities.</p>
        </div>

        <button
          id="add-destination-btn"
          onClick={handleOpenCreate}
          className="btn-violet-gradient px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination Node</span>
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-white/10">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#A8B3C7] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search destination name, city, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white text-xs placeholder-[#A8B3C7] focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#080B16] p-1 rounded-lg border border-white/10 text-xs">
            {['All', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${priorityFilter === p
                  ? 'bg-[#8B5CF6] text-white shadow'
                  : 'text-[#A8B3C7] hover:text-white'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-[#A8B3C7] font-mono">
          Showing <strong className="text-white">{filtered.length}</strong> of {destinations.length} destination nodes
        </div>
      </div>

      {/* Destination Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#A8B3C7]">Loading destination nodes...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 rounded-xl text-center border border-white/10 space-y-3">
          <MapPin className="w-12 h-12 text-[#A8B3C7] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Destination Nodes Found</h3>
          <p className="text-xs text-[#A8B3C7]">Try changing search terms or add a new target node.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dst) => {
            const fulfillPct = dst.demand > 0 ? Math.min(100, Math.round((dst.delivered_qty / dst.demand) * 100)) : 0;
            return (
              <div
                key={dst.id}
                className="glass-panel p-5 rounded-xl border border-white/10 hover:border-[#8B5CF6]/40 transition-all duration-300 space-y-4 shadow-lg group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] font-bold text-sm">
                      {dst.id.split('-')[1]?.toUpperCase() || 'DST'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#8B5CF6] transition-colors">
                        {dst.name}
                      </h3>
                      <p className="text-xs text-[#A8B3C7] flex items-center gap-1 font-mono">
                        <MapPin className="w-3 h-3 text-[#8B5CF6]" />
                        <span>{dst.location}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border font-mono ${dst.priority === 'High'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : dst.priority === 'Medium'
                        ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                        : 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30'
                      }`}
                  >
                    {dst.priority}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#A8B3C7]">Fulfillment Progress</span>
                    <span className="text-[#32D583] font-bold">{fulfillPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#32D583] transition-all duration-500"
                      style={{ width: `${fulfillPct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-center font-mono">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-[#A8B3C7] block">Required Demand</span>
                    <span className="text-sm font-bold text-white">{dst.demand.toLocaleString()} u</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-[#A8B3C7] block">Delivered Qty</span>
                    <span className="text-sm font-bold text-[#32D583]">{dst.delivered_qty.toLocaleString()} u</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-[10px] text-[#A8B3C7] font-mono">
                    GPS: {dst.lat.toFixed(4)}, {dst.lng.toFixed(4)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(dst)}
                      className="p-1.5 rounded text-[#A8B3C7] hover:text-[#8B5CF6] hover:bg-white/5 cursor-pointer"
                      title="Edit Destination"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dst.id)}
                      className="p-1.5 rounded text-[#A8B3C7] hover:text-rose-400 hover:bg-white/5 cursor-pointer"
                      title="Delete Destination"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel-glow p-6 rounded-2xl border border-[#8B5CF6]/40 space-y-5 shadow-2xl bg-[#10182A]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8B5CF6]" />
                <span>{editingDst ? 'Edit Destination Node' : 'Add New Destination Node'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded text-[#A8B3C7] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#A8B3C7] font-semibold mb-1">Destination Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pune Fulfillment Center"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-[#A8B3C7] font-semibold mb-1">Location Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Maharashtra, India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Tomatoes"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Delivery Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[#A8B3C7] font-semibold">Forecast Demand (u) *</label>
                    <button
                      type="button"
                      onClick={() => {
                        if (formData.historical_sales > 0) {
                          setFormData({ ...formData, demand: Math.round(formData.historical_sales * 1.1) });
                        }
                      }}
                      className="text-[10px] text-[#32D5F5] hover:underline font-mono cursor-pointer"
                    >
                      Auto-Forecast
                    </button>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={formData.demand}
                    onChange={(e) => setFormData({ ...formData, demand: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Historical Sales (u)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.historical_sales}
                    onChange={(e) => setFormData({ ...formData, historical_sales: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.current_stock}
                    onChange={(e) => setFormData({ ...formData, current_stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Safety Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.safety_stock}
                    onChange={(e) => setFormData({ ...formData, safety_stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Incoming Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.incoming_stock}
                    onChange={(e) => setFormData({ ...formData, incoming_stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A8B3C7] font-semibold mb-1">Required Delivery Date</label>
                <input
                  type="date"
                  value={formData.required_delivery_date}
                  onChange={(e) => setFormData({ ...formData, required_delivery_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
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
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-[#A8B3C7] font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B16] border border-white/10 text-white focus:outline-none focus:border-[#8B5CF6]"
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
                  className="btn-violet-gradient px-5 py-2 rounded-lg text-xs font-bold"
                >
                  {editingDst ? 'Save Changes' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
