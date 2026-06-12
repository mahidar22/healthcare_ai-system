import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, UserPlus, Upload, FileText, CheckCircle, Search, Edit2, ChevronRight, Eye, Calendar, Plus } from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('Complete Blood Count (CBC)');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  // New Patient Form State
  const [newPat, setNewPat] = useState({
    name: '', email: '', gender: 'Male', age: 35, blood_group: 'O+', phone: '+91 9876543210', bmi: 24.5, blood_pressure: '120/80', cholesterol: 180, chronic_conditions: 'None', status: 'Outpatient'
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients/');
      setPatients(res.data || []);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/patients/', newPat);
      setPatients(prev => [...prev, res.data.patient]);
      setIsAddOpen(false);
      setNewPat({
        name: '', email: '', gender: 'Male', age: 35, blood_group: 'O+', phone: '+91 9876543210', bmi: 24.5, blood_pressure: '120/80', cholesterol: 180, chronic_conditions: 'None', status: 'Outpatient'
      });
    } catch (err) {
      console.error("Failed to add patient", err);
    }
  };

  const handleReportUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedPatient) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('report_type', reportType);

    try {
      setUploading(true);
      setUploadSuccess(null);
      const res = await api.post(`/patients/${selectedPatient.id}/upload_report`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadSuccess(res.data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" /> Patient Management Core
          </h2>
          <p className="text-xs text-slate-500 mt-1">Manage hospital census, update clinical profiles, and synchronize local lab reports.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add New Patient
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Patient Name or ID (e.g., P001, John)..."
          className="flex-1 text-xs px-2 py-1 outline-hidden text-slate-800 placeholder:text-slate-400"
        />
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-xl">
          {filteredPatients.length} Active
        </span>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">ID / Patient Name</th>
                <th className="py-4 px-6">Age / Gender</th>
                <th className="py-4 px-6">Blood Info</th>
                <th className="py-4 px-6">Vitals (BP / BMI)</th>
                <th className="py-4 px-6">Chronic Condition</th>
                <th className="py-4 px-6">Admission Date</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400">Loading patient telemetrics...</td></tr>
              ) : filteredPatients.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400">No patient matching search criteria</td></tr>
              ) : (
                filteredPatients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200/60 shadow-2xs">
                          {pat.id}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{pat.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{pat.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">{pat.age} Yrs / <span className="font-normal text-slate-500">{pat.gender}</span></td>
                    <td className="py-4 px-6 font-bold text-rose-600">{pat.blood_group}</td>
                    <td className="py-4 px-6 text-slate-600">
                      <span className="font-bold text-slate-800">{pat.blood_pressure}</span> mmHg / <span className="font-bold text-slate-800">{pat.bmi}</span> BMI
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        pat.chronic_conditions === 'None' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pat.chronic_conditions}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">{pat.admission_date}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block ${
                        pat.status === 'ICU' ? 'bg-rose-100 text-rose-700' :
                        pat.status === 'Inpatient' ? 'bg-indigo-100 text-indigo-700' :
                        pat.status === 'Discharged' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {pat.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedPatient(pat); setIsReportModalOpen(true); }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-600 font-bold rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
                          title="Upload Lab Report"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Lab
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Patient */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-8 space-y-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-blue-600" /> Patient Registration Vector
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Full Name</label>
                  <input type="text" required value={newPat.name} onChange={e => setNewPat({...newPat, name: e.target.value})} placeholder="e.g. David Miller" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Email Address</label>
                  <input type="email" required value={newPat.email} onChange={e => setNewPat({...newPat, email: e.target.value})} placeholder="david.miller@health.ai" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Age</label>
                  <input type="number" required min={1} max={110} value={newPat.age} onChange={e => setNewPat({...newPat, age: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Gender</label>
                  <select value={newPat.gender} onChange={e => setNewPat({...newPat, gender: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Blood Group</label>
                  <select value={newPat.blood_group} onChange={e => setNewPat({...newPat, blood_group: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition">
                    <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Blood Pressure</label>
                  <input type="text" required value={newPat.blood_pressure} onChange={e => setNewPat({...newPat, blood_pressure: e.target.value})} placeholder="125/80" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">BMI</label>
                  <input type="number" step="0.1" required value={newPat.bmi} onChange={e => setNewPat({...newPat, bmi: parseFloat(e.target.value)})} placeholder="24.5" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Cholesterol</label>
                  <input type="number" required value={newPat.cholesterol} onChange={e => setNewPat({...newPat, cholesterol: parseInt(e.target.value)})} placeholder="190" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Chronic Conditions</label>
                  <input type="text" value={newPat.chronic_conditions} onChange={e => setNewPat({...newPat, chronic_conditions: e.target.value})} placeholder="None, or Diabetes..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Admission Status</label>
                  <select value={newPat.status} onChange={e => setNewPat({...newPat, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition">
                    <option value="Outpatient">Outpatient</option>
                    <option value="Inpatient">Inpatient</option>
                    <option value="ICU">ICU</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-5 py-3 rounded-2xl hover:bg-slate-100 text-slate-600 font-bold transition">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-500/20 transition">Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Lab Report */}
      {isReportModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Upload className="w-6 h-6 text-blue-600" /> AI OCR Lab Parser
              </h3>
              <button onClick={() => { setIsReportModalOpen(false); setUploadSuccess(null); }} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-sm text-slate-800">Uploading for: {selectedPatient.name}</p>
              <p className="text-xs text-slate-500">Supports PDF / Images. Automated text extraction, reference margin checking, and abnormal flagging will execute instantaneously.</p>
            </div>

            <form onSubmit={handleReportUpload} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Lab Report Test Category</label>
                <select value={reportType} onChange={e => setReportType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-600 outline-hidden transition font-semibold">
                  <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                  <option value="Lipid Profile Test">Lipid Profile Test</option>
                  <option value="Fasting Blood Glucose">Fasting Blood Glucose</option>
                  <option value="Renal Function Test">Renal Function Test</option>
                  <option value="Liver Function Panel">Liver Function Panel</option>
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-200 hover:border-blue-600 rounded-2xl p-6 text-center cursor-pointer transition relative bg-slate-50/50">
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-blue-600 mx-auto animate-bounce" />
                  <p className="font-bold text-slate-700 text-sm">
                    {file ? file.name : 'Click or drag scan file here'}
                  </p>
                  <p className="text-[10px] text-slate-400">Max size 10MB. PDF, PNG, JPG, JPEG</p>
                </div>
              </div>

              {uploading && (
                <p className="text-center text-xs font-semibold text-blue-600 animate-pulse">Running Optical Character Extraction...</p>
              )}

              {uploadSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-900">
                  <p className="font-bold flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle className="w-4 h-4" /> Lab Report Successfully Parsed!
                  </p>
                  <p className="font-semibold text-slate-700 mt-1">Status: {uploadSuccess.status_summary}</p>
                  {uploadSuccess.abnormal_flags && uploadSuccess.abnormal_flags.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className="font-bold text-rose-700 text-[10px] uppercase">Flagged Range Abnormalities:</p>
                      <ul className="list-disc list-inside text-rose-800">
                        {uploadSuccess.abnormal_flags.map((f, i) => (<li key={i}>{f}</li>))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button type="button" onClick={() => { setIsReportModalOpen(false); setUploadSuccess(null); }} className="px-5 py-3 rounded-2xl hover:bg-slate-100 text-slate-600 font-bold transition">Done</button>
                <button type="submit" disabled={!file || uploading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md transition flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Execute OCR Extraction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
