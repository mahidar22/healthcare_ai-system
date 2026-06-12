import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { Activity, FileText, Calendar, Heart, ShieldCheck, Download, AlertCircle, ArrowUpRight } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState({ lab_reports: [], appointments: [] });
  const [loading, setLoading] = useState(true);

  const activePatientId = user?.patient_id || 'P001';
  const activeName = user?.name || 'John Doe';

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/patients/${activePatientId}/history`);
        setHistory(res.data || { lab_reports: [], appointments: [] });
      } catch (err) {
        console.error("Failed to fetch patient history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [activePatientId]);

  // Download printable HTML Appointment Pass helper
  const downloadAppointmentTicket = (app) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hospital Consultation Ticket - ${app.id}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; padding: 40px; color: #1e293b; margin: 0; }
    .ticket { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: linear-gradient(135deg, #2563eb, #4f46e5); color: #ffffff; padding: 35px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
    .badge { display: inline-block; background: #10b981; color: white; font-size: 13px; font-weight: 800; padding: 6px 20px; border-radius: 999px; text-transform: uppercase; margin-top: 16px; letter-spacing: 1px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .body { padding: 40px 35px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 25px; }
    .grid-full { grid-template-columns: 1fr; }
    .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px; }
    .value { font-size: 18px; font-weight: 700; color: #0f172a; }
    .doctor { font-size: 20px; color: #4f46e5; font-weight: 800; }
    .notes { font-size: 15px; font-style: italic; color: #334155; background: #f8fafc; padding: 18px; border-radius: 14px; border-left: 4px solid #3b82f6; font-weight: 500; }
    .footer { background: #f1f5f9; padding: 25px; text-align: center; font-size: 12px; color: #64748b; }
    @media print { body { background: white; padding: 0; } .ticket { box-shadow: none; border: 2px solid #000; } }
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <h1>MedAI Operational Suite</h1>
      <p>Official Hospital Consultation Pass</p>
      <span class="badge">${app.status}</span>
    </div>
    <div class="body">
      <div class="grid">
        <div>
          <div class="label">Patient Name</div>
          <div class="value">${app.patient_name || activeName}</div>
        </div>
        <div>
          <div class="label">Patient ID</div>
          <div class="value">${app.patient_id || activePatientId}</div>
        </div>
      </div>
      <div class="grid">
        <div>
          <div class="label">Specialist Physician</div>
          <div class="doctor">${app.doctor_name}</div>
        </div>
        <div>
          <div class="label">Department</div>
          <div class="value" style="color: #3b82f6;">${app.specialization}</div>
        </div>
      </div>
      <div class="grid">
        <div>
          <div class="label">Consultation Date</div>
          <div class="value">${app.appointment_date}</div>
        </div>
        <div>
          <div class="label">Designated Time</div>
          <div class="value">${app.appointment_time}</div>
        </div>
      </div>
      <div class="grid-full" style="margin-top: 20px;">
        <div class="label">Chief Clinical Complaint / Notes</div>
        <div class="notes">"${app.notes || 'Routine consultation'}"</div>
      </div>
    </div>
    <div class="footer">
      <p>Please arrive 15 minutes prior to your designated consultation slot.</p>
      <p style="margin-top: 6px; font-weight: 700; color: #475569;">Pass Ref: ${app.id} • Authenticated Core Telemetry</p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hospital_Appointment_Pass_${app.id}_${(app.patient_name || activeName).replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const healthTrends = [
    { month: "Jan", bpSys: 135, bpDia: 88, glucose: 145, cholesterol: 240, bmi: 31.5 },
    { month: "Feb", bpSys: 132, bpDia: 85, glucose: 138, cholesterol: 235, bmi: 31.2 },
    { month: "Mar", bpSys: 130, bpDia: 84, glucose: 135, cholesterol: 230, bmi: 30.8 },
    { month: "Apr", bpSys: 128, bpDia: 82, glucose: 125, cholesterol: 220, bmi: 30.1 },
    { month: "May", bpSys: 125, bpDia: 80, glucose: 115, cholesterol: 210, bmi: 29.5 },
    { month: "Jun", bpSys: 122, bpDia: 78, glucose: 108, cholesterol: 195, bmi: 28.9 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-blue-100 backdrop-blur-xs">
            Patient Operational Care
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome back, {activeName}</h2>
          <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
            Here is your live personalized healthcare snapshot. Your AI diagnostic indicators show stable progression across all vital vectors this month.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 self-stretch md:self-auto flex items-center justify-between gap-6 z-10 shadow-lg">
          <div>
            <p className="text-xs text-blue-200 font-medium">Health Triage Score</p>
            <p className="text-4xl font-black text-emerald-300 flex items-center gap-2 mt-0.5">
              92<span className="text-base text-white font-normal">% Optimal</span>
            </p>
          </div>
          <ShieldCheck className="w-12 h-12 text-emerald-300 shrink-0" />
        </div>
      </div>

      {/* Vital KPI Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Blood Pressure</p>
            <p className="text-2xl font-black text-slate-800 mt-1">122 / 78 <span className="text-xs font-normal text-slate-500">mmHg</span></p>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md mt-2 inline-block">Optimal</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
            <Activity className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Fasting Glucose</p>
            <p className="text-2xl font-black text-slate-800 mt-1">108 <span className="text-xs font-normal text-slate-500">mg/dL</span></p>
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md mt-2 inline-block">Excellent</span>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
            <Heart className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Cholesterol</p>
            <p className="text-2xl font-black text-slate-800 mt-1">195 <span className="text-xs font-normal text-slate-500">mg/dL</span></p>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md mt-2 inline-block">Target Met</span>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50 text-purple-600">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Current BMI</p>
            <p className="text-2xl font-black text-slate-800 mt-1">28.9 <span className="text-xs font-normal text-slate-500">Overweight</span></p>
            <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-md mt-2 inline-block">Improving</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50 text-amber-600">
            <AlertCircle className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Health Progression Vector</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tracking Fasting Glucose & Systolic BP</p>
            </div>
            <span className="text-xs bg-slate-100 font-semibold px-3 py-1 rounded-full text-slate-600">
              6 Months Trend
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrends}>
                <defs>
                  <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[60, 160]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="glucose" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorGlucose)" name="Glucose (mg/dL)" />
                <Area type="monotone" dataKey="bpSys" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBP)" name="Systolic BP (mmHg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Lipid & Weight Optimization</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly Total Cholesterol trajectory</p>
            </div>
            <span className="text-xs bg-slate-100 font-semibold px-3 py-1 rounded-full text-slate-600">
              Target &lt; 200 mg/dL
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={healthTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[100, 300]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1' }} />
                <Bar dataKey="cholesterol" fill="#6366f1" radius={[8, 8, 0, 0]} name="Cholesterol (mg/dL)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Reports & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lab Reports */}
        <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Recent Lab Reports
            </h3>
            <span className="text-xs font-semibold text-slate-400">OCR Analyzed</span>
          </div>
          {loading ? (
            <p className="text-slate-400 text-xs py-4 text-center">Loading reports...</p>
          ) : history.lab_reports.length === 0 ? (
            <p className="text-slate-400 text-xs py-6 text-center">No lab reports found for this patient.</p>
          ) : (
            <div className="space-y-3">
              {history.lab_reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition flex items-center justify-between gap-4 border border-slate-200/60">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">{rep.report_type}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{rep.summary}</p>
                    {rep.abnormal_flags && rep.abnormal_flags !== 'None' ? (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md inline-block mt-2">
                        Flagged: {rep.abnormal_flags}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md inline-block mt-2">
                        Normal / Optimal
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-slate-400 hidden sm:inline">{rep.report_date}</span>
                    <a
                      href={`/${rep.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white text-blue-600 hover:bg-blue-50 border border-slate-200 shadow-2xs transition flex items-center justify-center"
                      title="Download / View Scan"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Active Appointments
            </h3>
            <span className="text-xs font-semibold text-slate-400">Synchronized</span>
          </div>
          {loading ? (
            <p className="text-slate-400 text-xs py-4 text-center">Loading appointments...</p>
          ) : history.appointments.length === 0 ? (
            <p className="text-slate-400 text-xs py-6 text-center">No booked appointments found.</p>
          ) : (
            <div className="space-y-3">
              {history.appointments.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition flex flex-col justify-between gap-3 border border-slate-200/60">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-slate-800 truncate">{app.doctor_name}</p>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-md">
                        {app.specialization}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 uppercase tracking-wider ${
                      app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'Rescheduled' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-slate-600 font-semibold flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {app.appointment_date} at {app.appointment_time}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">"{app.notes}"</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end">
                    <button
                      onClick={() => downloadAppointmentTicket(app)}
                      className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-1.5 text-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" /> Download Appointment Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
