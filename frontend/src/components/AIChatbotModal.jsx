import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

const AIChatbotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! I am your AI Healthcare Assistant. I am completely powered by our self-contained operational NLP core. How can I help you today? Try asking about:\n• 'Check my symptoms for fever and cough'\n• 'How many ICU beds or ventilators are available?'\n• 'What is diabetes or hypertension?'\n• 'Help me book a doctor appointment'",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chatbot/', { message: currentInput, user_role: 'patient' });
      const botMsg = {
        id: messages.length + 2,
        sender: 'bot',
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: messages.length + 2,
        sender: 'bot',
        text: "I encountered a minor system issue while parsing your intent. Please try again or check your live dashboard.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const presetQuestions = [
    "Check symptoms for fever and body ache",
    "How many ICU beds are available?",
    "What is the recommended HbA1c level?",
    "Guide me to Doctor Appointments"
  ];

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              Healthcare AI Bot <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h3>
            <p className="text-[10px] text-blue-100">Live self-contained AI Triage & Triage Engine</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/10 text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Preset question chips */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
        {presetQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            className="text-[11px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 shrink-0 transition flex items-center gap-1 shadow-2xs"
          >
            {q} <ArrowRight className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 self-end mb-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none font-medium'
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-200/80'
              }`}
            >
              {m.text}
              <div
                className={`text-[9px] mt-1 text-right ${
                  m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {m.time}
              </div>
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 self-end mb-1 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5 justify-start items-center text-slate-400 text-xs py-1">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 flex items-center gap-2 shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" /> AI is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target)}
          placeholder="Ask AI anything about healthcare..."
          className="flex-1 bg-slate-100 hover:bg-slate-200/60 focus:bg-white text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-blue-600 outline-hidden transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition flex items-center justify-center shadow-md shadow-blue-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default AIChatbotModal;
