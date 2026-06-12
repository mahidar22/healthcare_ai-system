import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { Bot, HeartPulse, LogOut } from 'lucide-react';

const Navbar = ({ onOpenChat }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left Application Brand */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => navigate('/login')}
          className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20 flex items-center justify-center cursor-pointer"
          title="Go to Authentication Portal"
        >
          <HeartPulse className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-slate-800 text-base tracking-tight flex items-center gap-2">
            MedAI Operational Core
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200/60 uppercase">
              Agentic Edition
            </span>
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">AI-Powered Healthcare Prediction & Resource Management System</p>
        </div>
      </div>

      {/* Right Controls: AI Chatbot, Notifications & Logout */}
      <div className="flex items-center gap-3">
        {/* AI Chatbot Button */}
        <button
          onClick={onOpenChat}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-2 border border-blue-200/60 transition shadow-2xs cursor-pointer shrink-0"
          title="Open AI Healthcare Assistant"
        >
          <Bot className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">AI Chatbot</span>
        </button>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-2 sm:px-3 sm:py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-rose-200/60 transition shadow-2xs cursor-pointer shrink-0"
          title="Sign out and return to portal"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
