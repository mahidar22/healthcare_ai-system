import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, HeartPulse, Sparkles, KeyRound, AlertTriangle, Loader2, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('patient@health.ai');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [executing, setExecuting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    setExecuting(true);
    setError(null);

    try {
      const res = await login(email, password);
      if (res.success) {
        const loggedInRole = res.user?.role || 'admin';
        if (loggedInRole === 'patient') navigate('/dashboard/patient');
        else if (loggedInRole === 'doctor') navigate('/dashboard/doctor');
        else navigate('/dashboard/admin');
      } else {
        setError(res.message || 'Invalid authentication credentials.');
      }
    } catch (err) {
      setError('Failed to reach authentication core.');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-slate-200/80 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
        {/* Decorative ambient blobs */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="text-center space-y-3 z-10 relative">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-xl shadow-blue-500/30 flex items-center justify-center mx-auto">
            <HeartPulse className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">MedAI Operational Suite</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Enter your credentials to initialize secure session</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl text-rose-800 text-xs font-semibold flex items-center gap-3 z-10 relative shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" /> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 z-10 relative text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex justify-between">
              <span>Authorized Email Address</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@health.ai"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden transition shadow-2xs pr-10"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex justify-between">
              <span>Secure Telemetry Password</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-slate-800 focus:bg-white focus:border-blue-600 outline-hidden transition shadow-2xs pr-10"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
            </div>
          </div>

          {/* Quick preset helper links */}
          <div className="pt-1 pb-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quick Auto-Fill Test Tiers:</p>
            <div className="flex items-center justify-between gap-1 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setEmail('patient@health.ai')}
                className="text-[11px] font-extrabold text-blue-700 hover:underline cursor-pointer px-2 py-0.5"
              >
                Patient
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => setEmail('doctor@health.ai')}
                className="text-[11px] font-extrabold text-indigo-700 hover:underline cursor-pointer px-2 py-0.5"
              >
                Doctor
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => setEmail('admin@health.ai')}
                className="text-[11px] font-extrabold text-emerald-700 hover:underline cursor-pointer px-2 py-0.5"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={executing}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {executing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {executing ? 'Verifying Neural Core Token...' : 'Execute Secure Secure Login'}
            </button>
          </div>
        </form>

        {/* Footer Link to Register */}
        <div className="text-center pt-4 border-t border-slate-100 z-10 relative">
          <p className="text-xs text-slate-500 font-medium">
            New hospital employee or prospective patient?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 transition ml-0.5">
              Create local account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
