import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Plus, Star, Phone, Mail, Award, CheckCircle2, Clock, ChevronRight, UserPlus } from 'lucide-react';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const { user } = useAuth();
  const currentRole = user?.role || 'admin';
  const allocatedDoctorName = 'Dr. Sarah Jenkins'; // Personal allocated doctor for patient P001

  const [newDoc, setNewDoc] = useState({
    name: '', email: '', specialization: 'Cardiology', phone: '+91 9876543210', department: 'Cardiology', availability: 'Available', experience_years: 10
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors/');
      setDoctors(res.data || []);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/doctors/', newDoc);
      setDoctors(prev => [...prev, res.data.doctor]);
      setIsAddOpen(false);
      setNewDoc({
        name: '', email: '', specialization: 'Cardiology', phone: '+91 9876543210', department: 'Cardiology', availability: 'Available', experience_years: 10
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateAvailability = async (id, newAvail) => {
    try {
      setUpdatingId(id);
      await api.put(`/doctors/${id}/availability`, { availability: newAvail });
      setDoctors(doctors.map(d => d.id === id ? { ...d, availability: newAvail } : d));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getAvailColor = (avail) => {
    switch (avail) {
      case 'Available': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Surgery': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'On Leave': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  // Filter based on client request: Patient can ONLY see their personal allocated doctor!
  const roleFilteredDoctors = doctors.filter(d => {
    if (currentRole === 'patient') {
      return d.name.includes('Jenkins') || d.id === 'D001';
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Action Bar */}
      <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-indigo-600" /> {currentRole === 'patient' ? 'My Allocated Primary Doctor' : 'Specialist Physicians Roster'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === 'patient' ? 'Viewing verified clinical telemetrics and contact channels for your designated specialist.' : 'Manage specialist rosters, supervise duty availability, and assign clinical departments.'}
          </p>
        </div>
        {currentRole !== 'patient' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add Specialist Doctor
          </button>
        )}
      </div>

      {/* Grid of Doctors */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading specialist telemetrics...</div>
      ) : roleFilteredDoctors.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No allocated specialist doctors found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleFilteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 space-y-5 flex flex-col justify-between hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 text-white font-black text-base flex items-center justify-center shadow-md">
                      {doc.name ? doc.name.replace('Dr. ', '').charAt(0) : 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-800">{doc.name}</h3>
                      <p className="text-xs font-semibold text-indigo-600 mt-0.5">{doc.specialization}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-amber-200/60 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {doc.rating || '4.9'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-400 shrink-0" /> <span className="font-semibold text-slate-800">{doc.experience_years} Years</span> Clinical Experience
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" /> {doc.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" /> {doc.phone}
                  </p>
                </div>
              </div>

              {/* Status control */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Duty Status:</span>
                {currentRole === 'patient' ? (
                  <span className={`text-xs font-black px-3 py-1 rounded-xl border capitalize ${getAvailColor(doc.availability)}`}>
                    {doc.availability}
                  </span>
                ) : (
                  <select
                    value={doc.availability}
                    disabled={updatingId === doc.id}
                    onChange={(e) => updateAvailability(doc.id, e.target.value)}
                    className={`text-xs font-black px-3 py-1.5 rounded-xl border outline-hidden cursor-pointer transition capitalize ${getAvailColor(doc.availability)}`}
                  >
                    <option value="Available">Available</option>
                    <option value="In Surgery">In Surgery</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Busy">Busy</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Doctor (Only for Doctors / Admins) */}
      {currentRole !== 'patient' && isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-indigo-600" /> Onboard Specialist Physician
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Doctor Name</label>
                <input type="text" required value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} placeholder="e.g. Dr. Rajesh Sharma" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Email Address</label>
                  <input type="email" required value={newDoc.email} onChange={e => setNewDoc({...newDoc, email: e.target.value})} placeholder="doctor@health.ai" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Phone Number</label>
                  <input type="text" required value={newDoc.phone} onChange={e => setNewDoc({...newDoc, phone: e.target.value})} placeholder="+91 9876543210" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Specialization</label>
                  <input type="text" required value={newDoc.specialization} onChange={e => setNewDoc({...newDoc, specialization: e.target.value, department: e.target.value})} placeholder="e.g. Endocrinology, Oncology" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Experience (Years)</label>
                  <input type="number" required min={1} max={50} value={newDoc.experience_years} onChange={e => setNewDoc({...newDoc, experience_years: parseInt(e.target.value)})} placeholder="12" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-3 rounded-2xl hover:bg-slate-100 text-slate-600 font-bold transition">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition cursor-pointer">Confirm Onboarding</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
