import React, { useState } from 'react';
import api from '../services/api';
import { Scan, Upload, Sparkles, CheckCircle2, AlertTriangle, ChevronRight, RefreshCw, FileText, Activity } from 'lucide-react';

const ReportAnalysis = () => {
  const [text, setText] = useState(
    "PATIENT MEDICAL LAB SCAN 2026\nPatient Name: John Doe\nAge: 52\n\n--- CLINICAL ASSAYS ---\nFasting Blood Sugar: 158 mg/dL  (Ref: 70-99)\nHemoglobin: 11.1 g/dL  (Ref: 13.5-17.5)\nTotal Cholesterol: 265 mg/dL  (Ref: < 200)\nSerum Creatinine: 1.4 mg/dL  (Ref: 0.6-1.2)\nBlood Pressure: 160/98 mmHg"
  );
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const presets = [
    { label: 'Diabetic Assay Scan', text: "CENTRAL DIAGNOSTICS LAB\nAssay: Glycemic Panel\nFasting Blood Sugar: 165 mg/dL\nHbA1c: 8.2%\nCholesterol: 210 mg/dL\nBP: 135/85" },
    { label: 'Cardiovascular Risk Scan', text: "CARDIAC CENSUS ASSAY\nTotal Cholesterol: 285 mg/dL\nSerum Triglycerides: 240 mg/dL\nHemoglobin: 14.5 g/dL\nBlood Pressure: 170/105 mmHg" },
    { label: 'Renal Impairment Scan', text: "NEPHROLOGY LAB REPORT\nSerum Creatinine: 1.8 mg/dL\nBlood Urea Nitrogen (BUN): 35 mg/dL\nFasting Glucose: 115 mg/dL\nBP: 145/92" },
    { label: 'Normal / Healthy Scan', text: "ROUTINE WELLNESS ASSAY\nFasting Blood Sugar: 88 mg/dL\nHemoglobin: 15.2 g/dL\nTotal Cholesterol: 175 mg/dL\nSerum Creatinine: 0.9 mg/dL\nBlood Pressure: 118/78 mmHg" },
  ];

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);
      setAnalysis(null);
      // We can trigger OCR upload or simulate local analysis by talking to a custom endpoint or analyzing directly
      // Let's use our upload endpoint or a dedicated direct analysis
      // Let's see if we have a direct text analysis endpoint. In `backend/app/patients/routes.py` we have `/upload_report`. Let's create a quick endpoint in `analytics` or `prediction` or just use a dummy patient upload, OR we can add a simple POST endpoint to `analytics/ocr` or analyze it on the frontend/backend beautifully!
      // In fact, let's create a highly reliable API route or do both! Let's check if we can add a quick route to `backend/app/analytics/routes.py` or `reports`.
      // Let's verify or use the dummy upload!
      // To be 100% robust and elegant, let's add a clean POST endpoint `/analytics/analyze_report_text` to `backend/app/analytics/routes.py`! Let's see what `analytics/routes.py` has right now.
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Let's implement the live parsing directly or via backend
  const executeAnalysis = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      // If a file is provided, let's upload it to John Doe P001
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('report_type', 'Custom Lab Report Scan');
        const res = await api.post('/patients/P001/upload_report', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setAnalysis(res.data.analysis);
      } else {
        // We can do an immediate rich parse or send to backend
        // Let's upload a dummy blob or parse locally so it's instantaneous and 100% reliable
        const formData = new FormData();
        const dummyBlob = new Blob([text], { type: 'text/plain' });
        formData.append('file', dummyBlob, 'simulated_report.txt');
        formData.append('report_type', 'Simulated Lab Scan');
        const res = await api.post('/patients/P001/upload_report', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setAnalysis(res.data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest bg-emerald-500/30 text-emerald-200 px-3 py-1 rounded-full border border-emerald-500/40">
            Optical Character Recognition Core
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">AI Medical Report Analysis & OCR Parser</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Extract raw unstructured clinical metrics from PDF/Image lab reports, detect abnormal physiological ranges, and generate immediate automated risk escalation alerts.
          </p>
        </div>
      </div>

      {/* Preset quick test chips */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Quick OCR Simulations:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => { setText(p.text); setFile(null); setAnalysis(null); }}
            className="text-xs bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Input */}
        <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              <Scan className="w-5 h-5 text-emerald-600" /> Unstructured Clinical Text / Image Payload
            </h3>
          </div>

          <form onSubmit={executeAnalysis} className="space-y-5 text-xs">
            {/* Optional File Upload */}
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-600 rounded-2xl p-5 text-center cursor-pointer transition relative bg-slate-50/50">
              <input
                type="file"
                accept=".pdf,image/*,.txt"
                onChange={e => { setFile(e.target.files[0]); setAnalysis(null); }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="space-y-1">
                <Upload className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-700 text-sm">
                  {file ? file.name : 'Upload custom PDF, PNG, or JPG lab report'}
                </p>
                <p className="text-[10px] text-slate-400">Automated OCR triggers instantly. Or paste raw scan text below.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700 flex justify-between">
                <span>Raw Unstructured Scan Payload</span>
                <span className="text-[10px] text-slate-400 font-normal">Editable Assays</span>
              </label>
              <textarea
                rows="9"
                required
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Paste lab report scan assays here..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-hidden transition leading-relaxed"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
                {loading ? 'Running OCR Engine & Rule Margins...' : 'Execute Automated Report Parsing'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Parsed Display */}
        <div className="space-y-6">
          {analysis ? (
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl space-y-7 border border-teal-500/30 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 bg-teal-500/30 px-3 py-1 rounded-full border border-teal-500/40">
                    Analysis Completed
                  </span>
                  <h3 className="text-2xl font-black text-white mt-2">Clinical Audit Inference</h3>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest border inline-block ${
                    analysis.status_summary === 'Abnormalities Detected' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {analysis.status_summary}
                  </span>
                </div>
              </div>

              {/* Extracted Key Lab Metrics Table */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Parsed Laboratory Parameters
                </p>
                <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold text-teal-200">
                        <th className="py-3 px-4">Parameter</th>
                        <th className="py-3 px-4">Parsed Value</th>
                        <th className="py-3 px-4">Ref Margin</th>
                        <th className="py-3 px-4 text-right">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {analysis.metrics.map((m, mIdx) => (
                        <tr key={mIdx} className="hover:bg-white/5">
                          <td className="py-3 px-4 font-bold text-white">{m.parameter}</td>
                          <td className="py-3 px-4 font-mono text-amber-300 font-semibold">{m.value}</td>
                          <td className="py-3 px-4 text-slate-400">{m.reference}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              m.status.includes('High') || m.status.includes('Low') || m.status.includes('Elevated')
                                ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                                : 'bg-emerald-500/30 text-emerald-300'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Flagged Abnormalities & Risk Alerts */}
              {analysis.abnormal_flags && analysis.abnormal_flags.length > 0 && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl space-y-3 text-xs text-rose-200">
                  <p className="font-bold text-rose-300 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Critical Range Alerts & Clinical Escalation:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-rose-100">
                    {analysis.risk_alerts.map((alt, aIdx) => (
                      <li key={aIdx} className="font-semibold leading-relaxed">{alt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl shadow-xs border border-slate-200/80 text-center space-y-4 flex flex-col items-center justify-center min-h-[500px]">
              <div className="p-6 rounded-full bg-emerald-50 text-emerald-600">
                <Scan className="w-12 h-12 animate-pulse" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="font-extrabold text-slate-800 text-lg">Upload Scan or Trigger OCR Simulation</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click 'Execute Automated Report Parsing' to parse the clinical assays on the left and trigger physiological value comparisons.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;
