import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ShieldCheck, UserCheck, Stethoscope, ArrowRight, HeartPulse, KeyRound, AlertTriangle, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('patient');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [error, setError] = useState(null);
  const [executing, setExecuting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setExecuting(true);
    setError(null);

    try {
      const res = await register({
        name,
        email,
        password,
        role,
        specialization: role === 'doctor' ? specialization : undefined
      });
      if (res.success) {
        if (role === 'patient') navigate('/dashboard/patient');
        else if (role === 'doctor') navigate('/dashboard/doctor');
        else navigate('/dashboard/admin');
      } else {
        setError(res.message || 'Failed to onboard local account.');
      }
    } catch (err) {
      setError('Registration core connection failed.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-indigo-50/50 to-blue-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Brand */}
        <div className="text-center space-y-3 z-10 relative">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-2xl text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center mx-auto">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Onboard Active Triage Triage</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Create self-contained local operations profile</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl text-rose-800 text-xs font-semibold flex items-center gap-3 z-10 relative shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4 z-10 relative text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Operational Access Tier</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`py-2.5 rounded-xl font-black text-[11px] transition border cursor-pointer flex items-center justify-center gap-1 ${
                  role === 'patient' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Patient
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`py-2.5 rounded-xl font-black text-[11px] transition border cursor-pointer flex items-center justify-center gap-1 ${
                  role === 'doctor' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" /> Doctor
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 rounded-xl font-black text-[11px] transition border cursor-pointer flex items-center justify-center gap-1 ${
                  role === 'admin' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. David Miller"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-indigo-600 outline-hidden transition shadow-2xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Authorized Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="david.miller@health.ai"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-indigo-600 outline-hidden transition shadow-2xs"
            />
          </div>

          {role === 'doctor' && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="font-bold text-slate-700">Clinical Department</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-indigo-600 outline-hidden transition shadow-2xs cursor-pointer"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Nephrology">Nephrology</option>
                <option value="Oncology">Oncology</option>
                <option value="Neurology">Neurology</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Secure Telemetry Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-indigo-600 outline-hidden transition shadow-2xs pr-10"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={executing}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {executing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {executing ? 'Registering Operational Payload...' : 'Confirm Registration & Enter Workspace'}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 z-10 relative">
          <p className="text-xs text-slate-500 font-medium">
            Already onboarded on hospital core?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition ml-0.5">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
