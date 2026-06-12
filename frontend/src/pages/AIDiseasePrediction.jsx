import React, { useState } from 'react';
import api from '../services/api';
import { Activity, Sparkles, CheckCircle2, AlertTriangle, HelpCircle, UserCheck, ChevronRight, BarChart, RefreshCw, Cpu, Layers } from 'lucide-react';

const AIDiseasePrediction = () => {
  const [form, setForm] = useState({
    age: 65, bmi: 32.5, blood_pressure: '160/95', cholesterol: 285, symptoms: 'Chest pain, shortness of breath on exertion, chronic fatigue', model_type: 'random_forest'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const presets = [
    { label: 'Heart Disease Risk', data: { age: 68, bmi: 33.1, blood_pressure: '165/98', cholesterol: 290, symptoms: 'Severe chest pain, radiating arm pain, shortness of breath', model_type: 'random_forest' } },
    { label: 'Diabetes Profile', data: { age: 54, bmi: 36.2, blood_pressure: '145/90', cholesterol: 240, symptoms: 'Polyuria, excessive thirst, dry mouth, blurred vision', model_type: 'xgboost' } },
    { label: 'Kidney Disease Profile', data: { age: 71, bmi: 28.0, blood_pressure: '155/92', cholesterol: 260, symptoms: 'Peripheral edema, chronic nausea, metallic taste in mouth', model_type: 'random_forest' } },
    { label: 'Cancer Risk Profile', data: { age: 62, bmi: 18.5, blood_pressure: '125/80', cholesterol: 190, symptoms: 'Unexplained rapid weight loss, persistent night sweats, chronic pain', model_type: 'logistic_regression' } },
    { label: 'Healthy Outpatient', data: { age: 29, bmi: 22.1, blood_pressure: '118/78', cholesterol: 165, symptoms: 'None, routine general physical checkup', model_type: 'random_forest' } },
  ];

  const handlePredict = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/prediction/disease', form);
      
      // Get treatment recommendations
      const recRes = await api.post('/recommendations/', {
        disease: res.data.prediction_results.prediction,
        risk_score: res.data.prediction_results.risk_score,
        symptoms: form.symptoms,
        severity_level: res.data.prediction_results.severity_level
      });

      setResult({
        ...res.data.prediction_results,
        recommendations: recRes.data
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to execute machine learning prediction.');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (presetData) => {
    setForm(presetData);
    setResult(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full border border-blue-500/40">
            Self-Contained ML Diagnostic Triage
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">AI Disease Prediction Telemetry</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Execute Random Forest, XGBoost, and Logistic Regression models against patient vitals and NLP symptom scores. Instantaneous probability breakdowns.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 self-stretch md:self-auto flex items-center justify-between gap-4 z-10 shadow-lg">
          <Cpu className="w-10 h-10 text-amber-300 shrink-0" />
          <div>
            <p className="text-xs text-blue-200 font-medium">Model Latency</p>
            <p className="text-2xl font-black text-white mt-0.5">14<span className="text-xs font-normal text-blue-300"> ms</span></p>
          </div>
        </div>
      </div>

      {/* Preset quick test chips */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Simulate Patient Cases:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(p.data)}
            className="text-xs bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> {p.label}
          </button>
        ))}
      </div>

      {/* Two Columns: Left Form, Right AI Prediction Inference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Form */}
        <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" /> Vitals & Clinical Symptoms Vector
            </h3>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              Primed for ML
            </span>
          </div>

          <form onSubmit={handlePredict} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Patient Age</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={110}
                  value={form.age}
                  onChange={e => setForm({...form, age: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden transition"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700">Body Mass Index (BMI)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={form.bmi}
                  onChange={e => setForm({...form, bmi: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="font-bold text-slate-700">Blood Pressure (Sys / Dia)</label>
                <input
                  type="text"
                  required
                  value={form.blood_pressure}
                  onChange={e => setForm({...form, blood_pressure: e.target.value})}
                  placeholder="130/85"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden transition"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700">Total Serum Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  required
                  value={form.cholesterol}
                  onChange={e => setForm({...form, cholesterol: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700">Clinical Complaints & Symptoms (Evaluated via AI Triage)</label>
              <textarea
                rows="3"
                required
                value={form.symptoms}
                onChange={e => setForm({...form, symptoms: e.target.value})}
                placeholder="Describe patient symptoms in natural text..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden transition leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700">Select Self-Contained Classifier Core</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({...form, model_type: 'random_forest'})}
                  className={`p-3 rounded-2xl font-bold text-xs transition border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    form.model_type === 'random_forest'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Random Forest
                </button>
                <button
                  type="button"
                  onClick={() => setForm({...form, model_type: 'xgboost'})}
                  className={`p-3 rounded-2xl font-bold text-xs transition border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    form.model_type === 'xgboost'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <Cpu className="w-4 h-4" /> XGBoost Core
                </button>
                <button
                  type="button"
                  onClick={() => setForm({...form, model_type: 'logistic_regression'})}
                  className={`p-3 rounded-2xl font-bold text-xs transition border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    form.model_type === 'logistic_regression'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <BarChart className="w-4 h-4" /> Logistic Reg.
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
                {loading ? 'Executing Neural Forward Pass...' : 'Run Machine Learning Inference'}
              </button>
            </div>
          </form>
        </div>

        {/* Output Diagnostics View */}
        <div className="space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-300 p-5 rounded-3xl text-rose-800 text-xs font-semibold flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" /> {error}
            </div>
          )}

          {result ? (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl space-y-7 border border-indigo-500/30 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 bg-indigo-500/30 px-3 py-1 rounded-full border border-indigo-500/40">
                    Diagnostic Telemetry Complete
                  </span>
                  <h3 className="text-2xl font-black text-amber-300 mt-2">{result.prediction}</h3>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest border inline-block ${
                    result.severity_level === 'Critical' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' :
                    result.severity_level === 'High' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    Severity: {result.severity_level}
                  </span>
                </div>
              </div>

              {/* Kpis */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                  <p className="text-xs text-indigo-200 font-medium">Telemetry Risk Score</p>
                  <p className="text-3xl font-black text-white mt-1 flex items-center gap-2">
                    {result.risk_score}<span className="text-sm font-normal text-indigo-300">% Confirmed</span>
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                  <p className="text-xs text-indigo-200 font-medium">NLP Symptom Severity Score</p>
                  <p className="text-3xl font-black text-emerald-400 mt-1">
                    {(result.symptoms_analyzed_score * 100).toFixed(0)} <span className="text-sm font-normal text-indigo-300">/ 100</span>
                  </p>
                </div>
              </div>

              {/* Full Multi-Class Probabilities Breakdown */}
              {result.probability_breakdown && (
                <div className="space-y-2.5 bg-white/5 p-5 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart className="w-3.5 h-3.5" /> Multi-Class Probability Vector Distribution
                  </p>
                  <div className="space-y-2 text-xs pt-1">
                    {Object.entries(result.probability_breakdown).map(([diseaseName, prob]) => (
                      <div key={diseaseName} className="space-y-1">
                        <div className="flex justify-between text-indigo-100 font-semibold text-[11px]">
                          <span>{diseaseName}</span>
                          <span className={prob > 50 ? 'text-amber-300 font-bold' : ''}>{prob}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              prob > 75 ? 'bg-rose-500' : prob > 40 ? 'bg-amber-400' : 'bg-blue-500'
                            }`}
                            style={{ width: `${prob}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action */}
              {result.recommendations && (
                <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 p-6 rounded-2xl border border-blue-400/30 space-y-4">
                  <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Prescribed Treatment Recommendations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-blue-200 uppercase tracking-wider text-[10px] mb-1.5">Recommended Clinical Action</p>
                      <ul className="space-y-1 list-disc list-inside text-slate-100">
                        {result.recommendations.suggested_treatments.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-blue-200 uppercase tracking-wider text-[10px] mb-1.5">Diagnostic Panel Required</p>
                      <ul className="space-y-1 list-disc list-inside text-slate-100">
                        {result.recommendations.recommended_diagnostic_tests.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
                    <span>Refer to Specialist: <strong className="text-white">{result.recommendations.recommended_specialist}</strong></span>
                    <span className="bg-white/20 font-bold text-white px-3 py-1 rounded-full">{result.recommendations.urgency}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl shadow-xs border border-slate-200/80 text-center space-y-4 flex flex-col items-center justify-center min-h-[500px]">
              <div className="p-6 rounded-full bg-blue-50 text-blue-600">
                <Cpu className="w-12 h-12 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="font-extrabold text-slate-800 text-lg">Machine Learning Core Operative</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a simulation preset from above or enter custom clinical telemetrics to trigger random forest ensembles and multi-class probability vectors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIDiseasePrediction;
