import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AIChatbotModal from '../components/AIChatbotModal';

const MainLayout = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar onOpenChat={() => setIsChatOpen(true)} />
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        {!isAuthPage && <Sidebar />}
        <main className={`flex-1 overflow-y-auto w-full ${!isAuthPage ? 'p-8 max-w-7xl mx-auto' : ''}`}>
          {children}
        </main>
      </div>
      <AIChatbotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default MainLayout;
