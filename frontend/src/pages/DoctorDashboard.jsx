import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Activity, Sparkles, CheckCircle2, UserCheck, ChevronRight, FileText, HeartPulse, Clock } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientEhr, setPatientEhr] = useState([]);
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  const activeDoctorId = user?.doctor_id || 'D001';
  const activeDoctorName = user?.name || 'Dr. Sarah Jenkins';
  const activeSpecialization = user?.specialization || 'Cardiology';

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/doctors/${activeDoctorId}/assigned_patients`);
        const patientsList = res.data || [];
        setAssignedPatients(patientsList);
        // Per client structural request: Do not open patient details until doc clicks them explicitly!
        setSelectedPatient(null);
      } catch (err) {
        console.error("Failed to fetch assigned patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [activeDoctorId]);

  const handleSelectPatient = async (patientApp) => {
    setSelectedPatient(patientApp);
    setAiPrediction(null);
    try {
      const res = await api.get(`/ehr/patient/${patientApp.patient_id}`);
      setPatientEhr(res.data || []);
    } catch (err) {
      console.error("Failed to fetch EHR", err);
    }
  };

  const handleRunAiDiagnostics = async () => {
    if (!selectedPatient) return;
    try {
      setPredicting(true);
      const mockAge = 62;
      const mockBmi = 31.0;
      const mockBp = "155/95";
      const mockChol = 265;
      const mockSymptoms = selectedPatient.notes || "High blood pressure and fatigue";

      const res = await api.post('/prediction/disease', {
        age: mockAge,
        bmi: mockBmi,
        blood_pressure: mockBp,
        cholesterol: mockChol,
        symptoms: mockSymptoms,
        model_type: "random_forest"
      });

      const recRes = await api.post('/recommendations/', {
        disease: res.data.prediction_results.prediction,
        risk_score: res.data.prediction_results.risk_score,
        symptoms: mockSymptoms,
        severity_level: res.data.prediction_results.severity_level
      });

      setAiPrediction({
        ...res.data.prediction_results,
        recommendations: recRes.data
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest bg-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/40">
              {activeSpecialization} Department
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Duty
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Doctor Operational Center</h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Welcome, {activeDoctorName}. You have {assignedPatients.length} active patients assigned to your clinical roster today. Primed for interactive telemetry.
          </p>
        </div>
      </div>

      {/* Main Two-Column View: Left Assigned Patients, Right AI Telemetry & EHR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Patients List */}
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/80 space-y-4 flex flex-col max-h-[700px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Assigned Patients
            </h3>
            <span className="text-xs bg-slate-100 font-bold px-2.5 py-0.5 rounded-full text-slate-600">
              {assignedPatients.length} Total
            </span>
          </div>

          {loading ? (
            <p className="text-slate-400 text-xs py-8 text-center">Loading patients...</p>
          ) : assignedPatients.length === 0 ? (
            <p className="text-slate-400 text-xs py-12 text-center">No assigned patients found.</p>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-50">
              {assignedPatients.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => handleSelectPatient(pat)}
                  className={`p-4 rounded-2xl cursor-pointer transition flex items-center justify-between gap-3 border ${
                    selectedPatient?.id === pat.id
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-2xs font-extrabold'
                      : 'hover:bg-slate-50 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                      {pat.patient_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-800 truncate">{pat.patient_name}</p>
                      <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" /> {pat.appointment_time} ({pat.appointment_date})
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition shrink-0 ${selectedPatient?.id === pat.id ? 'text-indigo-600 translate-x-0.5' : 'text-slate-400'}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Review selected patient */}
        <div className="lg:col-span-2 space-y-8">
          {selectedPatient ? (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Selected Patient Banner & Run AI */}
              <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-800">{selectedPatient.patient_name}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                      ID: {selectedPatient.patient_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 italic font-medium">Chief Complaint: "{selectedPatient.notes}"</p>
                </div>
                <button
                  onClick={handleRunAiDiagnostics}
                  disabled={predicting}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white px-5 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2.5 shadow-md shadow-indigo-500/20 shrink-0 self-stretch sm:self-auto justify-center cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  {predicting ? 'Executing Local Telemetry...' : 'Run Live Live AI Diagnostics'}
                </button>
              </div>

              {/* AI Prediction Breakdown Card */}
              {aiPrediction && (
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-6 animate-in fade-in duration-300 border border-indigo-500/30">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg tracking-tight">AI Diagnostic Inference</h4>
                        <p className="text-xs text-indigo-200">Model Executed: Random Forest Ensemble Core</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest border ${
                        aiPrediction.severity_level === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                        aiPrediction.severity_level === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        Severity: {aiPrediction.severity_level}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                      <p className="text-xs text-indigo-200 font-medium">Primary Disease Vector</p>
                      <p className="text-2xl font-black text-amber-300 mt-1">{aiPrediction.prediction}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                      <p className="text-xs text-indigo-200 font-medium">Telemetry Risk Score</p>
                      <p className="text-2xl font-black text-white mt-1">{aiPrediction.risk_score} <span className="text-xs font-normal text-indigo-300">% Confirmed</span></p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                      <p className="text-xs text-indigo-200 font-medium">Symptoms Severity Vector</p>
                      <p className="text-2xl font-black text-white mt-1">{aiPrediction.symptoms_analyzed_score * 100} / 100</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {aiPrediction.recommendations && (
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4 text-slate-100">
                      <h5 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> AI Treatment Plan Plan & Protocol
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-2">
                          <p className="font-bold text-white uppercase tracking-wider text-[10px] opacity-80">Suggested Clinical Protocols</p>
                          <ul className="space-y-1 list-disc list-inside text-indigo-100">
                            {aiPrediction.recommendations.suggested_treatments.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="font-bold text-white uppercase tracking-wider text-[10px] opacity-80">Required Diagnostic Panels</p>
                          <ul className="space-y-1 list-disc list-inside text-indigo-100">
                            {aiPrediction.recommendations.recommended_diagnostic_tests.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Patient EHR History View */}
              <div className="bg-white p-7 rounded-3xl shadow-xs border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" /> Electronic Health Records Records (EHR)
                  </h4>
                  <span className="text-xs font-semibold text-slate-400">{patientEhr.length} Past Encounters</span>
                </div>

                {patientEhr.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-semibold text-slate-500">No previous EHR records recorded for this patient.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patientEhr.map((ehr) => (
                      <div key={ehr.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
                          <div>
                            <p className="font-bold text-sm text-slate-800">{ehr.diagnosis}</p>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">Attending: {ehr.doctor_name}</p>
                          </div>
                          <span className="text-xs font-bold bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                            {ehr.date}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Treatment Protocol Executed</p>
                          <p className="text-xs text-slate-700 mt-1 font-medium">{ehr.treatment_given}</p>
                        </div>

                        {ehr.prescriptions && ehr.prescriptions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase">Prescribed Medications</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {ehr.prescriptions.map((p, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-xs flex items-center justify-between">
                                  <div>
                                    <p className="font-bold text-slate-800">{p.medicine}</p>
                                    <p className="text-[10px] text-slate-500">{p.dosage} - {p.frequency}</p>
                                  </div>
                                  <span className="text-[10px] font-semibold bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                                    {p.duration}
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
              </div>
            </div>
          ) : (
            <div className="bg-white p-16 rounded-3xl shadow-xs border border-slate-200/80 text-center space-y-4 flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner border border-indigo-100">
                <UserCheck className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="font-black text-slate-800 text-xl tracking-tight">Inspect Patient Clinical Profile</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Select any assigned patient from the clinical roster on the left to instantly slide their vital telemetrics, chief complaints, and complete Electronic Health Records (EHR) into view.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
