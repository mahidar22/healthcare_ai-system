import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Box, Wrench, RefreshCw, AlertTriangle, CheckCircle, Plus, Search, Edit3, ChevronRight, Save } from 'lucide-react';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit modal state
  const [editingRes, setEditingRes] = useState(null);
  const [editForm, setEditForm] = useState({
    available_quantity: 0, in_use_quantity: 0, maintenance_quantity: 0, status: 'Optimal'
  });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/resources');
      setResources(res.data || []);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleEditClick = (res) => {
    setEditingRes(res);
    setEditForm({
      available_quantity: res.available_quantity,
      in_use_quantity: res.in_use_quantity,
      maintenance_quantity: res.maintenance_quantity,
      status: res.status
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingRes) return;
    try {
      const res = await api.put(`/analytics/resources/${editingRes.id}`, editForm);
      setResources(resources.map(r => r.id === editingRes.id ? res.data.resource : r));
      setEditingRes(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredResources = resources.filter(r =>
    r.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase()) || r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Box className="w-7 h-7 text-emerald-600" /> Life Support & Critical Resource Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">Supervise Ventilator banks, track Portable Oxygen units, and update equipment maintenance indicators.</p>
        </div>
        <button
          onClick={fetchResources}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-2xs shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Resources
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search items by Name, Category (Life Support, Oxygen), or Hospital Location..."
          className="flex-1 text-xs px-2 py-1 outline-hidden text-slate-800 placeholder:text-slate-400"
        />
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
          {filteredResources.length} Categorized
        </span>
      </div>

      {/* Resources Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">ID / Item Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6 text-center">Total Quant.</th>
                <th className="py-4 px-6 text-center">Available reserves</th>
                <th className="py-4 px-6 text-center">Active In-Use</th>
                <th className="py-4 px-6 text-center">Maintenance Standby</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400">Loading synchronized resource databases...</td></tr>
              ) : filteredResources.length === 0 ? (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400">No matching medical equipment tracking entries</td></tr>
              ) : (
                filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-emerald-50/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-300 shadow-2xs">
                          {res.id}
                        </div>
                        <p className="font-extrabold text-sm text-slate-800">{res.item_name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-600">{res.category}</td>
                    <td className="py-4 px-6 text-slate-500 font-medium">{res.location}</td>
                    <td className="py-4 px-6 text-center font-extrabold text-slate-700 text-sm">{res.total_quantity}</td>
                    <td className="py-4 px-6 text-center font-black text-emerald-600 text-sm">{res.available_quantity}</td>
                    <td className="py-4 px-6 text-center font-black text-indigo-600 text-sm">{res.in_use_quantity}</td>
                    <td className="py-4 px-6 text-center font-bold text-amber-600">{res.maintenance_quantity}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                        res.status === 'Critical Storage' ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleEditClick(res)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center gap-1.5 text-xs inline-flex cursor-pointer"
                        title="Update Quantity Tracking"
                      >
                        <Wrench className="w-3.5 h-3.5" /> Edit Stats
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Resource */}
      {editingRes && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-emerald-600" /> Update Quantity Tracking
              </h3>
              <button onClick={() => setEditingRes(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-800">{editingRes.item_name}</p>
              <p className="text-xs text-slate-500">Location: {editingRes.location} (Total: {editingRes.total_quantity} Units)</p>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Available</label>
                  <input type="number" required min={0} max={editingRes.total_quantity} value={editForm.available_quantity} onChange={e => setEditForm({...editForm, available_quantity: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-emerald-600 outline-hidden transition font-black text-emerald-600" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">In Use</label>
                  <input type="number" required min={0} max={editingRes.total_quantity} value={editForm.in_use_quantity} onChange={e => setEditForm({...editForm, in_use_quantity: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-emerald-600 outline-hidden transition font-black text-indigo-600" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Maintenance</label>
                  <input type="number" required min={0} max={editingRes.total_quantity} value={editForm.maintenance_quantity} onChange={e => setEditForm({...editForm, maintenance_quantity: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-emerald-600 outline-hidden transition font-bold text-amber-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Storage Telemetry Status</label>
                <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-emerald-600 outline-hidden transition font-bold">
                  <option value="Optimal">Optimal</option>
                  <option value="Critical Storage">Critical Storage</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setEditingRes(null)} className="px-5 py-3 rounded-2xl hover:bg-slate-100 text-slate-600 font-bold transition">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Telemetrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManagement;
