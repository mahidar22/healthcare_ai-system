import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle2, Clock, CalendarPlus, UserCheck, Stethoscope, FileText, Search, Edit3, ChevronRight, Download, Printer } from 'lucide-react';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [activeApp, setActiveApp] = useState(null);

  const { user } = useAuth();
  const currentRole = user?.role || 'admin';
  const activePatientId = user?.patient_id || 'P001';
  const activePatientName = user?.name || 'John Doe';

  // New Appointment state
  const [newApp, setNewApp] = useState({
    patient_id: activePatientId, patient_name: activePatientName, doctor_id: 'D001', doctor_name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', appointment_date: '2026-06-15', appointment_time: '10:30 AM', notes: 'Routine follow-up consultation.'
  });

  // Reschedule state
  const [rescheduleData, setRescheduleData] = useState({
    appointment_date: '2026-06-20', appointment_time: '02:00 PM'
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments/');
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/appointments/book', newApp);
      setAppointments(prev => [...prev, res.data.appointment]);
      setIsBookOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/appointments/${id}/approve`);
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Confirmed' } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!activeApp) return;
    try {
      await api.put(`/appointments/${activeApp.id}/reschedule`, rescheduleData);
      setAppointments(appointments.map(a => a.id === activeApp.id ? {
        ...a, appointment_date: rescheduleData.appointment_date, appointment_time: rescheduleData.appointment_time, status: 'Rescheduled'
      } : a));
      setIsRescheduleOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Download printable HTML Appointment Pass
  const downloadAppointmentTicket = (app) => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Hospital Appointment Confirmation - ${app.id}</title>
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
          <div class="value">${app.patient_name}</div>
        </div>
        <div>
          <div class="label">Patient ID</div>
          <div class="value">${app.patient_id || 'P001'}</div>
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
    a.download = `Hospital_Appointment_Pass_${app.id}_${app.patient_name.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter based on role & search
  const roleFilteredApps = appointments.filter(a => {
    if (currentRole === 'patient') {
      return a.patient_id === activePatientId || a.patient_name.toLowerCase().includes('john');
    }
    return true;
  });

  const filteredApps = roleFilteredApps.filter(a =>
    a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || a.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) || a.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-indigo-600" /> {currentRole === 'patient' ? 'My Hospital Consultations' : 'Hospital Appointments Gateway'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === 'patient' ? `Viewing personal consultation schedules and passes for ${activePatientName}` : 'Book patient consultations, approve pending schedules, and execute rescheduling vectors.'}
          </p>
        </div>
        <button
          onClick={() => setIsBookOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 shrink-0 cursor-pointer"
        >
          <CalendarPlus className="w-4 h-4" /> Book Appointment
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={currentRole === 'patient' ? "Search consultations by Doctor Name or Department..." : "Search by Patient Name, Doctor, or Department..."}
          className="flex-1 text-xs px-2 py-1 outline-hidden text-slate-800 placeholder:text-slate-400"
        />
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
          {filteredApps.length} Synchronized
        </span>
      </div>

      {/* Appointments Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading synchronized appointments...</div>
      ) : filteredApps.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No active consultation entries found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                      ID: {app.id}
                    </span>
                    <h3 className="font-bold text-lg text-slate-800 mt-1.5">{app.patient_name}</h3>
                    {currentRole !== 'patient' && (
                      <p className="text-xs text-slate-500 font-medium">Patient ID: {app.patient_id}</p>
                    )}
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shrink-0 ${
                    app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                    app.status === 'Rescheduled' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    app.status === 'Completed' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                    'bg-slate-100 text-slate-800 border border-slate-300 animate-pulse'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="flex items-center gap-2 font-bold text-slate-900">
                    <Stethoscope className="w-4 h-4 text-indigo-600 shrink-0" /> {app.doctor_name}
                  </p>
                  <p className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                    {app.specialization}
                  </p>
                  <div className="pt-2 flex items-center gap-2 font-semibold text-slate-800">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" /> {app.appointment_date} at {app.appointment_time}
                  </div>
                  <p className="text-xs text-slate-500 italic pt-1 line-clamp-2">"{app.notes}"</p>
                </div>
              </div>

              {/* Action buttons including Download Appointment Pass */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => downloadAppointmentTicket(app)}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer shadow-2xs"
                  title="Download Official Appointment Ticket Pass"
                >
                  <Download className="w-4 h-4" /> Download Pass
                </button>

                {currentRole !== 'patient' && app.status !== 'Confirmed' && app.status !== 'Completed' && (
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                )}
                <button
                  onClick={() => { setActiveApp(app); setRescheduleData({ appointment_date: app.appointment_date, appointment_time: app.appointment_time }); setIsRescheduleOpen(true); }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" /> Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Book Appointment */}
      {isBookOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <CalendarPlus className="w-6 h-6 text-indigo-600" /> Schedule New Appointment
              </h3>
              <button onClick={() => setIsBookOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Patient ID</label>
                  <input
                    type="text" required value={newApp.patient_id}
                    disabled={currentRole === 'patient'}
                    onChange={e => setNewApp({...newApp, patient_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Patient Name</label>
                  <input
                    type="text" required value={newApp.patient_name}
                    disabled={currentRole === 'patient'}
                    onChange={e => setNewApp({...newApp, patient_name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Specialist Physician</label>
                <select
                  value={newApp.doctor_name}
                  onChange={e => {
                    const sel = e.target.value;
                    const spec = sel.includes('Jenkins') ? 'Cardiology' : sel.includes('Sharma') ? 'Endocrinology' : sel.includes('Patel') ? 'Oncology' : 'General Medicine';
                    setNewApp({...newApp, doctor_name: sel, specialization: spec});
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition font-semibold cursor-pointer"
                >
                  <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardiology)</option>
                  <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Endocrinology)</option>
                  <option value="Dr. Amit Patel">Dr. Amit Patel (Oncology)</option>
                  <option value="Dr. Emily Watson">Dr. Emily Watson (Neurology)</option>
                  <option value="Dr. Vikram Malhotra">Dr. Vikram Malhotra (General Medicine)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Consultation Date</label>
                  <input type="date" required value={newApp.appointment_date} onChange={e => setNewApp({...newApp, appointment_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Preferred Time</label>
                  <input type="text" required value={newApp.appointment_time} onChange={e => setNewApp({...newApp, appointment_time: e.target.value})} placeholder="10:30 AM" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Chief Clinical Complaint / Notes</label>
                <textarea rows="3" value={newApp.notes} onChange={e => setNewApp({...newApp, notes: e.target.value})} placeholder="Brief description of symptoms..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsBookOpen(false)} className="px-5 py-3 rounded-2xl hover:bg-slate-100 text-slate-600 font-bold transition">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition cursor-pointer">Confirm Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reschedule */}
      {isRescheduleOpen && activeApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Edit3 className="w-6 h-6 text-amber-500" /> Reschedule Consultation
              </h3>
              <button onClick={() => setIsRescheduleOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-800">{activeApp.patient_name}</p>
              <p className="text-xs text-slate-500">With {activeApp.doctor_name} ({activeApp.specialization})</p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">New Consultation Date</label>
                <input type="date" required value={rescheduleData.appointment_date} onChange={e => setRescheduleData({...rescheduleData, appointment_date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-amber-500 outline-hidden transition" />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">New Consultation Time</label>
                <input type="text" required value={rescheduleData.appointment_time} onChange={e => setRescheduleData({...rescheduleData, appointment_time: e.target.value})} placeholder="02:30 PM" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-amber-500 outline-hidden transition" />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsRescheduleOpen(false)} className="px-5 py-3 rounded-2xl hover:bg-slate-100 text-slate-600 font-bold transition">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl shadow-md transition cursor-pointer">Confirm Reschedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
