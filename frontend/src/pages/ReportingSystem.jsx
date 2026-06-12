import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Printer, RefreshCw, PieChart as PieIcon, Activity, Bed, Users, TrendingUp, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

const ReportingSystem = () => {
  const [reports, setReports] = useState({
    disease: null, beds: null, patients: null, recovery: null
  });
  const [activeTab, setActiveTab] = useState('disease');
  const [loading, setLoading] = useState(true);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const [resDis, resBeds, resPat, resRec] = await Promise.all([
        api.get('/reports/disease'),
        api.get('/reports/beds'),
        api.get('/reports/patients'),
        api.get('/reports/recovery')
      ]);
      setReports({
        disease: resDis.data,
        beds: resBeds.data,
        patients: resPat.data,
        recovery: resRec.data
      });
    } catch (err) {
      console.error("Failed to fetch reporting data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  const handleDownloadSummary = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `medai_operational_executive_summary_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full text-indigo-200 border border-white/20">
            Comprehensive Hospital Generator Core
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">AI Executive Reporting Generator System</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Real-time multi-dimensional executive intelligence across Disease Censuses, Bed Allocations, Demographic Breakdowns, and Clinical Discharge Outcomes.
          </p>
        </div>
        <div className="flex items-center gap-3 z-10 shrink-0 self-stretch md:self-auto justify-end">
          <button
            onClick={handlePrint}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 border border-white/20 shadow-xs cursor-pointer"
            title="Print Application Summary"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={handleDownloadSummary}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
            title="Download JSON Payload"
          >
            <Download className="w-4 h-4" /> Download JSON Payload
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('disease')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'disease' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" /> 1. Disease Reports
        </button>
        <button
          onClick={() => setActiveTab('beds')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'beds' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bed className="w-4 h-4" /> 2. Bed Utilization Reports
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'patients' ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" /> 3. Patient Census Stats
        </button>
        <button
          onClick={() => setActiveTab('recovery')}
          className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'recovery' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> 4. Recovery Outcomes
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center text-slate-400 text-sm">
          Generating executive intelligence tables...
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* TAB 1: DISEASE */}
          {activeTab === 'disease' && reports.disease && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" /> {reports.disease.title}
                  </h3>
                  <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full">
                    Active Distribution
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reports.disease.disease_distribution}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="disease" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                      <Bar dataKey="cases" fill="#2563eb" radius={[8, 8, 0, 0]} name="Active Patient Cases" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
                <h4 className="font-extrabold text-slate-800 text-base">Executive Clinical Note</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium">
                  {reports.disease.summary}
                </p>
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">OCR Flagged Scans</span>
                  <span className="text-2xl font-black text-blue-700">{reports.disease.total_flagged_lab_reports}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BEDS */}
          {activeTab === 'beds' && reports.beds && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                    <Bed className="w-5 h-5 text-indigo-600" /> {reports.beds.title}
                  </h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full">
                    {reports.beds.utilization_rate_overall}% Occupied
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reports.beds.breakdown}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                      <Bar dataKey="occupied" fill="#6366f1" radius={[8, 8, 0, 0]} name="Occupied Capacity" />
                      <Bar dataKey="total" fill="#94a3b8" radius={[8, 8, 0, 0]} name="Total Capacity" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-4">
                <h4 className="font-extrabold text-slate-800 text-base">Intensive Care Telemetry</h4>
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">ICU Utilization Index</span>
                  <span className="text-2xl font-black text-rose-600">{reports.beds.icu_utilization_rate}%</span>
                </div>
                <div className="space-y-2 pt-2 text-xs">
                  {reports.beds.breakdown.map((b, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-slate-50 rounded-xl font-medium text-slate-700">
                      <span>{b.category}</span>
                      <span className="font-bold">{b.occupied} / {b.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PATIENTS */}
          {activeTab === 'patients' && reports.patients && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6 lg:col-span-2">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" /> {reports.patients.title}
                  </h3>
                  <span className="text-xs bg-purple-50 text-purple-700 font-bold px-3 py-1 rounded-full">
                    Avg Age: {reports.patients.average_patient_age} Yrs
                  </span>
                </div>

                <div className="h-72 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reports.patients.status_distribution}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                        paddingAngle={5} dataKey="count" nameKey="status"
                        label={({ status, count }) => `${status}: ${count}`}
                      >
                        {reports.patients.status_distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
                <h4 className="font-extrabold text-slate-800 text-base">Demographic Audit</h4>
                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900">Total Synchronized Census</span>
                  <span className="text-2xl font-black text-purple-700">{reports.patients.total_active_patients}</span>
                </div>
                <div className="space-y-2 pt-2 text-xs">
                  {reports.patients.gender_distribution?.map((g, idx) => (
                    <div key={idx} className="flex justify-between p-3 bg-slate-50 rounded-xl font-medium text-slate-700">
                      <span>{g.gender} Demographic</span>
                      <span className="font-bold">{g.count} Patients</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RECOVERY */}
          {activeTab === 'recovery' && reports.recovery && (
            <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" /> {reports.recovery.title}
                </h3>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full">
                  {reports.recovery.overall_recovery_success_rate}% Success Protocol
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-900 font-medium">Overall Recovery Index</p>
                  <p className="text-3xl font-black text-emerald-700 mt-1">{reports.recovery.overall_recovery_success_rate}%</p>
                </div>
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-900 font-medium">Avg Hospital Stay</p>
                  <p className="text-3xl font-black text-blue-700 mt-1">{reports.recovery.average_hospital_stay_days} Days</p>
                </div>
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-900 font-medium">30-Day Readmission vector</p>
                  <p className="text-3xl font-black text-amber-700 mt-1">{reports.recovery.readmission_rate_thirty_days}%</p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports.recovery.monthly_discharges}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                    <Bar dataKey="discharges" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Total Discharges" />
                    <Bar dataKey="recoveries" fill="#10b981" radius={[6, 6, 0, 0]} name="Successful Recoveries" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportingSystem;
