import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, UserCheck, Stethoscope, Activity, Calendar, Pill, Search, ChevronRight, CheckCircle2 } from 'lucide-react';

const EHRManagement = () => {
  const [ehrRecords, setEhrRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPrescOpen, setIsPrescOpen] = useState(false);
  const [selectedEhr, setSelectedEhr] = useState(null);

  const { user } = useAuth();
  const currentRole = user?.role || 'admin';
  const activePatientId = user?.patient_id || 'P001';

  // New EHR State
  const [newEhr, setNewEhr] = useState({
    patient_id: 'P001', patient_name: 'John Doe', doctor_id: 'D001', doctor_name: 'Dr. Sarah Jenkins', diagnosis: 'Hyperlipidemia & Stage 1 Hypertension', treatment_given: 'Initiated cholesterol reduction dietary plan and low-dose ACE inhibitors.',
    vitals: { bp: '138/88', hr: '78', temp: '98.6 F', spO2: '98%' },
    prescriptions: [
      { medicine: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', duration: '30 Days' }
    ]
  });

  // New Prescription Item State
  const [newPrescItem, setNewPrescItem] = useState({
    medicine: '', dosage: '10mg', frequency: 'Once daily', duration: '15 Days'
  });

  const fetchEhr = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ehr/');
      setEhrRecords(res.data || []);
    } catch (err) {
      console.error("Failed to fetch EHR", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEhr();
  }, []);

  const handleCreateEhrSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/ehr/', newEhr);
      setEhrRecords(prev => [...prev, res.data.record]);
      setIsCreateOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEhr) return;
    try {
      const res = await api.post(`/ehr/${selectedEhr.id}/prescriptions`, newPrescItem);
      setEhrRecords(ehrRecords.map(r => r.id === selectedEhr.id ? res.data.record : r));
      setIsPrescOpen(false);
      setNewPrescItem({ medicine: '', dosage: '10mg', frequency: 'Once daily', duration: '15 Days' });
    } catch (err) {
      console.error(err);
    }
  };

  const roleFilteredRecords = ehrRecords.filter(r => {
    if (currentRole === 'patient') {
      return r.patient_id === activePatientId || r.patient_name.toLowerCase().includes('john');
    }
    return true;
  });

  const filteredRecords = roleFilteredRecords.filter(r =>
    r.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) || r.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" /> {currentRole === 'patient' ? 'My Verified Medical Records (EHR)' : 'Electronic Health Records (EHR) Operational Core'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {currentRole === 'patient' ? 'Inspect your past diagnostic encounters, verified specialist protocols, and active prescriptions.' : 'Store patient encounters locally, inspect diagnostic treatment histories, and manage prescriptions.'}
          </p>
        </div>
        {currentRole !== 'patient' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Local Encounter
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={currentRole === 'patient' ? "Search records by Attending Doctor or Clinical Diagnosis..." : "Search EHR by Patient Name, Attending Doctor, or Clinical Diagnosis..."}
          className="flex-1 text-xs px-2 py-1 outline-hidden text-slate-800 placeholder:text-slate-400"
        />
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
          {filteredRecords.length} Encounters
        </span>
      </div>

      {/* EHR Records List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading synchronized EHR encounters...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No verified medical records matching queries found.</div>
      ) : (
        <div className="space-y-6">
          {filteredRecords.map((ehr) => (
            <div key={ehr.id} className="bg-white rounded-3xl p-7 shadow-xs border border-slate-200/80 space-y-6 hover:shadow-md transition">
              {/* Encounter header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    {ehr.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-slate-800">{ehr.patient_name}</h3>
                      {currentRole !== 'patient' && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-md uppercase">
                          {ehr.patient_id}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Clinical Diagnosis: <span className="text-blue-600 font-bold">{ehr.diagnosis}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {ehr.date}
                  </span>
                  {currentRole !== 'patient' && (
                    <button
                      onClick={() => { setSelectedEhr(ehr); setIsPrescOpen(true); }}
                      className="px-4 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-indigo-200/60 cursor-pointer"
                    >
                      <Pill className="w-3.5 h-3.5" /> Add Prescription
                    </button>
                  )}
                </div>
              </div>

              {/* Middle Section: Telemetrics & Attending */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vitals Telemetry */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" /> Recorded Patient Vitals
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                      <span className="font-black text-slate-800 text-sm">{ehr.vitals?.bp || '120/80'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                      <span className="font-black text-slate-800 text-sm">{ehr.vitals?.hr || '75'} bpm</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">Body Temp</span>
                      <span className="font-black text-slate-800 text-sm">{ehr.vitals?.temp || '98.6 F'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block">Oxygen SpO2</span>
                      <span className="font-black text-emerald-600 text-sm">{ehr.vitals?.spO2 || '99%'}</span>
                    </div>
                  </div>
                </div>

                {/* Treatment details */}
                <div className="lg:col-span-2 bg-blue-50/30 p-5 rounded-2xl border border-blue-100 space-y-2 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Executed Clinical Protocol / Treatment</p>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium mt-1.5">{ehr.treatment_given}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold self-end pt-2">
                    Attending Specialist: <span className="text-slate-800">{ehr.doctor_name}</span>
                  </p>
                </div>
              </div>

              {/* Prescriptions breakdown */}
              {ehr.prescriptions && ehr.prescriptions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prescribed Medication Management</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {ehr.prescriptions.map((presc, pIdx) => (
                      <div key={pIdx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-300 transition">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-slate-800 truncate">{presc.medicine}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{presc.dosage} - {presc.frequency}</p>
                        </div>
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg shrink-0 border border-indigo-200/60">
                          {presc.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create EHR (Only for Doctors / Admins) */}
      {currentRole !== 'patient' && isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-8 space-y-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" /> Construct Local EHR Record
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <form onSubmit={handleCreateEhrSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Patient ID</label>
                  <input type="text" required value={newEhr.patient_id} onChange={e => setNewEhr({...newEhr, patient_id: e.target.value})} placeholder="P001" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition font-semibold" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Patient Name</label>
                  <input type="text" required value={newEhr.patient_name} onChange={e => setNewEhr({...newEhr, patient_name: e.target.value})} placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition font-semibold" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Attending Specialist</label>
                  <input type="text" required value={newEhr.doctor_name} onChange={e => setNewEhr({...newEhr, doctor_name: e.target.value})} placeholder="Dr. Sarah Jenkins" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Clinical Diagnosis</label>
                  <input type="text" required value={newEhr.diagnosis} onChange={e => setNewEhr({...newEhr, diagnosis: e.target.value})} placeholder="e.g. Type 2 Diabetes Mellitus" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition font-bold" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Treatment Plan & Clinical Protocol Given</label>
                <textarea rows="3" required value={newEhr.treatment_given} onChange={e => setNewEhr({...newEhr, treatment_given: e.target.value})} placeholder="Detailed clinical summary of treatments prescribed..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
              </div>

              {/* Vitals Input */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">Patient Vitals Telemetry</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <input type="text" value={newEhr.vitals.bp} onChange={e => setNewEhr({...newEhr, vitals: {...newEhr.vitals, bp: e.target.value}})} placeholder="BP: 135/85" className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-blue-600" />
                  <input type="text" value={newEhr.vitals.hr} onChange={e => setNewEhr({...newEhr, vitals: {...newEhr.vitals, hr: e.target.value}})} placeholder="HR: 76" className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-blue-600" />
                  <input type="text" value={newEhr.vitals.temp} onChange={e => setNewEhr({...newEhr, vitals: {...newEhr.vitals, temp: e.target.value}})} placeholder="Temp: 98.6 F" className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-blue-600" />
                  <input type="text" value={newEhr.vitals.spO2} onChange={e => setNewEhr({...newEhr, vitals: {...newEhr.vitals, spO2: e.target.value}})} placeholder="SpO2: 99%" className="bg-white border border-slate-200 rounded-xl p-2.5 text-xs outline-hidden focus:border-blue-600" />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-3 rounded-2xl hover:bg-slate-100 text-slate-600 font-bold transition">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition cursor-pointer">Save Encounter Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Prescription */}
      {currentRole !== 'patient' && isPrescOpen && selectedEhr && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Pill className="w-6 h-6 text-indigo-600" /> Append Prescription
              </h3>
              <button onClick={() => setIsPrescOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-800">{selectedEhr.patient_name}</p>
              <p className="text-xs text-slate-500">Diagnosis: {selectedEhr.diagnosis}</p>
            </div>

            <form onSubmit={handleAddPrescriptionSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Medication Brand / Name</label>
                <input type="text" required value={newPrescItem.medicine} onChange={e => setNewPrescItem({...newPrescItem, medicine: e.target.value})} placeholder="e.g. Metformin" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition font-bold" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Dosage</label>
                  <input type="text" required value={newPrescItem.dosage} onChange={e => setNewPrescItem({...newPrescItem, dosage: e.target.value})} placeholder="500mg" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Duration</label>
                  <input type="text" required value={newPrescItem.duration} onChange={e => setNewPrescItem({...newPrescItem, duration: e.target.value})} placeholder="30 Days" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Frequency</label>
                <input type="text" required value={newPrescItem.frequency} onChange={e => setNewPrescItem({...newPrescItem, frequency: e.target.value})} placeholder="Twice daily after food" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-600 outline-hidden transition" />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsPrescOpen(false)} className="px-5 py-3 rounded-2xl hover:bg-slate-100 text-slate-600 font-bold transition">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition cursor-pointer">Confirm Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EHRManagement;
