import React, { useState } from 'react';
import api from '../services/api';
import { Activity, Sparkles, HeartHandshake, ShieldAlert, AlertCircle, RefreshCw, BarChart, Layers, Clock, TrendingUp } from 'lucide-react';

const AIPatientOutcome = () => {
  const [form, setForm] = useState({
    age: 68, bmi: 31.0, chronic_count: 3, severity: 8, vital_stability: 0.35
  });
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    { label: 'Critical ICU Admission', data: { age: 74, bmi: 34.2, chronic_count: 4, severity: 9, vital_stability: 0.2 } },
    { label: 'Moderate Inpatient Ward', data: { age: 55, bmi: 28.1, chronic_count: 2, severity: 5, vital_stability: 0.65 } },
    { label: 'Stable Outpatient Surgery', data: { age: 38, bmi: 23.0, chronic_count: 0, severity: 2, vital_stability: 0.9 } },
    { label: 'Elderly Readmission Risk', data: { age: 82, bmi: 29.5, chronic_count: 5, severity: 7, vital_stability: 0.4 } },
  ];

  const handlePredictOutcome = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/analytics/patient_outcome', form);
      setOutcome(res.data?.outcome);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetData) => {
    setForm(presetData);
    setOutcome(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full border border-purple-500/40">
            Random Forest Regressor Core
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Patient Outcome & Recovery Prediction</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Project exact recovery probabilities, ICU escalation risks, 30-day readmission indices, and estimated hospital stay lengths using local healthcare telemetrics.
          </p>
        </div>
      </div>

      {/* Quick Test Presets */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Quick Clinical Scenarios:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p.data)}
            className="text-xs bg-slate-100 hover:bg-purple-600 text-slate-700 hover:text-white font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" /> Clinical Telemetry Parameters
            </h3>
            <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
              4 Regressor Core
            </span>
          </div>

          <form onSubmit={handlePredictOutcome} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Patient Age ({form.age} Yrs)</label>
                <input
                  type="range" min={18} max={95} value={form.age}
                  onChange={e => setForm({...form, age: parseInt(e.target.value)})}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700">BMI ({form.bmi})</label>
                <input
                  type="range" step="0.5" min={17} max={45} value={form.bmi}
                  onChange={e => setForm({...form, bmi: parseFloat(e.target.value)})}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Chronic Conditions Count ({form.chronic_count})</label>
                <input
                  type="range" min={0} max={6} value={form.chronic_count}
                  onChange={e => setForm({...form, chronic_count: parseInt(e.target.value)})}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700">Admission Clinical Severity (1-10): {form.severity}</label>
                <input
                  type="range" min={1} max={10} value={form.severity}
                  onChange={e => setForm({...form, severity: parseInt(e.target.value)})}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between font-bold text-slate-700 text-xs">
                <span>Vital Signs Stability Index</span>
                <span className="text-purple-700 font-extrabold">{form.vital_stability * 100}% Stable</span>
              </div>
              <input
                type="range" step="0.05" min={0.1} max={1.0} value={form.vital_stability}
                onChange={e => setForm({...form, vital_stability: parseFloat(e.target.value)})}
                className="w-full accent-purple-600 cursor-pointer mt-2"
              />
              <p className="text-[10px] text-slate-400 mt-1">1.0 represents completely stable vitals; 0.1 represents active multi-organ vital instability.</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-500/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
                {loading ? 'Running Multi-Target Forecast...' : 'Predict Patient Outcome Indices'}
              </button>
            </div>
          </form>
        </div>

        {/* Outcome Indices Display */}
        <div className="space-y-6">
          {outcome ? (
            <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl space-y-7 border border-purple-500/30 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-300 bg-purple-500/30 px-3 py-1 rounded-full border border-purple-500/40">
                    AI Forecast Overview
                  </span>
                  <h3 className="text-2xl font-black text-amber-300 mt-2">{outcome.risk_summary}</h3>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest border inline-block ${
                    outcome.icu_risk_percent > 60 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' :
                    outcome.icu_risk_percent > 30 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    ICU Risk: {outcome.icu_risk_percent}%
                  </span>
                </div>
              </div>

              {/* 4 Outcome Metrics Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <p className="text-xs text-purple-200 font-medium flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-400" /> Estimated Hospital Stay
                  </p>
                  <p className="text-3xl font-black text-white mt-2">
                    {outcome.estimated_hospital_stay_days} <span className="text-sm font-normal text-purple-300">Days</span>
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <p className="text-xs text-purple-200 font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Recovery Probability
                  </p>
                  <p className="text-3xl font-black text-emerald-300 mt-2">
                    {outcome.recovery_probability_percent} <span className="text-sm font-normal text-purple-300">% Success</span>
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <p className="text-xs text-purple-200 font-medium flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" /> ICU Escalation Vector
                  </p>
                  <p className="text-3xl font-black text-rose-300 mt-2">
                    {outcome.icu_risk_percent} <span className="text-sm font-normal text-purple-300">% Index</span>
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <p className="text-xs text-purple-200 font-medium flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-400" /> 30-Day Readmission Index
                  </p>
                  <p className="text-3xl font-black text-amber-300 mt-2">
                    {outcome.readmission_risk_percent} <span className="text-sm font-normal text-purple-300">% Index</span>
                  </p>
                </div>
              </div>

              <div className="bg-white/10 p-5 rounded-2xl border border-white/20 text-xs leading-relaxed text-slate-100">
                <p className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Clinical Escalation Protocol
                </p>
                {outcome.icu_risk_percent > 50 ? (
                  <p>Immediate ICU Bed reservation and Ventilator standby tracking is strongly recommended based on vital telemetrics. Attending specialist must be alerted.</p>
                ) : (
                  <p>Routine General Ward monitoring. Patient shows strong recovery indications under standard clinical care protocols.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl shadow-xs border border-slate-200/80 text-center space-y-4 flex flex-col items-center justify-center min-h-[500px]">
              <div className="p-6 rounded-full bg-purple-50 text-purple-600">
                <HeartHandshake className="w-12 h-12 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="font-extrabold text-slate-800 text-lg">Outcome Regressor Core Operative</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Adjust the clinical severity and vital stability indicators on the left to project exact ICU risks and recovery probabilities instantly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPatientOutcome;
