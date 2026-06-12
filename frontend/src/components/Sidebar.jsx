import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Stethoscope, Calendar, FileText, Activity, HeartHandshake, Bed, Box, Scan, PieChart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const currentRole = user?.role || 'admin';

  const navGroups = [
    {
      title: "Dashboards",
      items: [
        { name: "My Health Dashboard", path: "/dashboard/patient", icon: LayoutDashboard, roles: ['patient'] },
        { name: "Doctor Operations Core", path: "/dashboard/doctor", icon: LayoutDashboard, roles: ['doctor'] },
        { name: "Patient Health Telemetrics", path: "/dashboard/patient", icon: LayoutDashboard, roles: ['doctor', 'admin'] },
        { name: "Admin Infrastructure", path: "/dashboard/admin", icon: LayoutDashboard, roles: ['admin'] },
        { name: "Doctor Telemetrics Core", path: "/dashboard/doctor", icon: LayoutDashboard, roles: ['admin'] }
      ]
    },
    {
      title: "Core Operations",
      items: [
        { name: "Hospital Census (Patients)", path: "/patients", icon: Users, roles: ['doctor', 'admin'] },
        { name: "Specialist Duty Roster", path: "/doctors", icon: Stethoscope, roles: ['doctor', 'admin'] },
        { name: "Hospital Appointments", path: "/appointments", icon: Calendar, roles: ['patient', 'doctor', 'admin'] },
        { name: "Health Records (EHR)", path: "/ehr", icon: FileText, roles: ['patient', 'doctor', 'admin'] }
      ]
    },
    {
      title: "AI Diagnostic Triage",
      items: [
        { name: "AI Disease Classifier", path: "/ai/disease-prediction", icon: Activity, roles: ['patient', 'doctor', 'admin'] },
        { name: "Outcome & ICU Forecaster", path: "/ai/outcome-prediction", icon: HeartHandshake, roles: ['patient', 'doctor', 'admin'] },
        { name: "OCR Medical Scan Parser", path: "/ai/report-analysis", icon: Scan, roles: ['patient', 'doctor', 'admin'] }
      ]
    },
    {
      title: "Infrastructure & Storage",
      items: [
        { name: "Bed & ICU Allocations", path: "/beds", icon: Bed, roles: ['admin'] },
        { name: "Ventilators & Oxygen Banks", path: "/resources", icon: Box, roles: ['admin'] },
        { name: "Executive Report Generator", path: "/reports", icon: PieChart, roles: ['admin'] }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Active User Card */}
      <div className="p-4 mx-3 mt-3 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-lg shadow-slate-900/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 font-extrabold text-sm flex items-center justify-center border-2 border-white/20">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs truncate">{user?.name || 'Super Admin'}</p>
          <span className="text-[10px] bg-white/20 text-blue-200 font-black px-2.5 py-0.5 rounded-full inline-block mt-0.5 capitalize tracking-wider">
            {currentRole} Access
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group, idx) => {
          // Filter items based on user role
          const filteredItems = group.items.filter(item => item.roles.includes(currentRole));

          if (filteredItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-2">
                {group.title}
              </h4>
              {filteredItems.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition relative ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.name}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </div>

      {/* Bottom Information Footer */}
      <div className="p-4 border-t border-slate-100 text-[10px] text-slate-400 text-center space-y-0.5">
        <p className="font-semibold text-slate-600">MedAI Core v1.0.0</p>
        <p>Active Triage & Tier Filtering</p>
      </div>
    </aside>
  );
};

export default Sidebar;
