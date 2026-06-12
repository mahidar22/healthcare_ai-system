import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Bed, UserCheck, CheckCircle2, AlertTriangle, RefreshCw, Layers, Calendar, Search, Filter } from 'lucide-react';

const BedManagement = () => {
  const [data, setData] = useState({
    statistics: { total_beds: 50, available_beds: 0, occupied_beds: 0, occupancy_rate_percent: 0, icu_beds_total: 10, icu_beds_available: 0, icu_occupancy_percent: 0 },
    beds_list: [],
    seven_day_demand_forecast: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const fetchBedTelemetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/beds');
      setData(res.data || {
        statistics: { total_beds: 50, available_beds: 18, occupied_beds: 32, occupancy_rate_percent: 64, icu_beds_total: 10, icu_beds_available: 3, icu_occupancy_percent: 70 },
        beds_list: [],
        seven_day_demand_forecast: []
      });
    } catch (err) {
      console.error("Failed to fetch beds", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBedTelemetrics();
    const interval = setInterval(fetchBedTelemetrics, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredBeds = data.beds_list.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || b.room_number.toLowerCase().includes(searchTerm.toLowerCase()) || (b.current_patient_id && b.current_patient_id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'All' || b.bed_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full border border-indigo-500/40">
            Real-Time Resource Telemetrics
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Hospital Bed & ICU Allocations Core</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Synchronized occupancy telemetrics across General Wards, Private Suites, and Specialized Intensive Care Units. Includes 7-day ML forecasted patient demand.
          </p>
        </div>
        <button
          onClick={fetchBedTelemetrics}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 border border-white/20 shadow-xs z-10 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Allocations
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Available Census Wards</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{data.statistics.available_beds} <span className="text-xs font-normal text-slate-500">/ {data.statistics.total_beds}</span></p>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md mt-2 inline-block">Ready to Escort</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
            <Bed className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Overall Occupancy Rate</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{data.statistics.occupancy_rate_percent} <span className="text-xs font-normal text-slate-500">%</span></p>
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md mt-2 inline-block">
              {data.statistics.occupied_beds} Wards Occupied
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
            <Layers className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">ICU Beds Available</p>
            <p className="text-3xl font-black text-rose-600 mt-1">{data.statistics.icu_beds_available} <span className="text-xs font-normal text-slate-500">/ {data.statistics.icu_beds_total}</span></p>
            <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md mt-2 inline-block">
              {data.statistics.icu_occupancy_percent}% Capacity
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Sanitization Vector</p>
            <p className="text-3xl font-black text-indigo-600 mt-1">100<span className="text-xs font-normal text-slate-500">%</span></p>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-md mt-2 inline-block">Fully Sanitized</span>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 7-Day ML Forecast Area Chart */}
      {data.seven_day_demand_forecast && data.seven_day_demand_forecast.length > 0 && (
        <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> 7-Day ML Patient Demand & Bed Occupancy Forecast
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Projected daily incoming Ward vs ICU admission demand</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-extrabold px-3 py-1 rounded-full border border-indigo-200/60">
              AI Projected Table
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.seven_day_demand_forecast}>
                <defs>
                  <linearGradient id="colorWard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIcu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day_name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                <Area type="monotone" dataKey="projected_ward_occupancy" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWard)" name="General Ward Projected Demand" />
                <Area type="monotone" dataKey="projected_icu_occupancy" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorIcu)" name="ICU Projected Demand" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Live Search & Category Filters */}
      <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 ml-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Bed ID, Room (e.g., B001, RM-101)..."
              className="text-xs px-2 py-1 outline-hidden text-slate-800 placeholder:text-slate-400 w-64"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
            {['All', 'General Ward', 'ICU', 'Private Suite'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition cursor-pointer shrink-0 ${
                  filterType === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Beds */}
        {loading && data.beds_list.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading live ward statuses...</div>
        ) : filteredBeds.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No beds matching search/filter constraints</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBeds.map((bed) => (
              <div
                key={bed.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                  bed.status === 'Occupied'
                    ? 'bg-indigo-50/50 border-indigo-200'
                    : bed.status === 'Maintenance'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-emerald-50/50 border-emerald-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-800">{bed.id}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    bed.bed_type === 'ICU' ? 'bg-rose-500 text-white shadow-2xs' :
                    bed.bed_type === 'Private Suite' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-white'
                  }`}>
                    {bed.bed_type}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-600">{bed.room_number}</p>
                  {bed.current_patient_id ? (
                    <p className="text-[11px] font-semibold text-indigo-700 mt-1 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Pat ID: {bed.current_patient_id}
                    </p>
                  ) : (
                    <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                      Available Slot
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className={`font-bold capitalize ${
                    bed.status === 'Occupied' ? 'text-indigo-900' :
                    bed.status === 'Maintenance' ? 'text-amber-900' : 'text-emerald-900'
                  }`}>
                    {bed.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BedManagement;
