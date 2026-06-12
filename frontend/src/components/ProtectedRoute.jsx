import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-16 text-center text-slate-400 text-xs">Verifying Access Clearance...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-rose-200/80 text-center space-y-6 max-w-lg mx-auto mt-12 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-rose-200">
          <ShieldAlert className="w-8 h-8 animate-bounce" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] bg-rose-50 text-rose-700 font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-rose-200/60">
            Security Clearance Restricted
          </span>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Access Restricted</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Your current authorization tier (<strong className="text-blue-600 capitalize">{user.role}</strong>) does not have required telemetric clearance to inspect this module.
          </p>
        </div>

        <div className="pt-2">
          <a
            href={user.role === 'patient' ? '/dashboard/patient' : user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/admin'}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-slate-900/20"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Authorized Portal
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
