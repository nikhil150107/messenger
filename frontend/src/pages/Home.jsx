import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, User, LogOut, Send, Quote } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const quote = {
  text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  author: "Nelson Mandela"
};

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [mobile, setMobile] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!mobile || mobile.replace(/\D/g, '').length < 7) return;
    const text = encodeURIComponent(`"${quote.text}"\n\n— ${quote.author}`);
    const number = mobile.replace(/\D/g, '');
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col text-slate-800">
      <header className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-400 rounded-lg flex items-center justify-center shadow-xs">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Messenger</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-full border border-sky-100 font-medium text-sm">
                  <User size={16} />
                  <span className="hidden sm:inline">My Profile</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary" className="py-1.5 px-4 text-sm h-auto min-h-0 rounded-lg">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-sky-100/50 border border-sky-100 overflow-hidden relative">
          <div className="h-2 w-full bg-sky-400" />

          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-50 rounded-2xl text-sky-500 mb-4">
                <Quote size={24} className="fill-sky-100" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Quote of the Day</h1>
              <p className="text-slate-500 text-sm mt-1">Share some inspiration with friends.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 relative">
              <Quote size={40} className="absolute top-4 left-4 text-slate-200/50 -z-0" />
              <p className="text-lg font-medium text-slate-700 italic relative z-10 leading-relaxed text-center">
                "{quote.text}"
              </p>
              <p className="text-sm font-bold text-sky-600 text-center mt-4 uppercase tracking-wide">
                — {quote.author}
              </p>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4">
              <div className="w-full">
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Send via WhatsApp
                </label>
                <input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter friend's WhatsApp number (with country code)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!mobile || mobile.replace(/\D/g, '').length < 7}
                  fullWidth
                  icon={<Send size={16} />}
                >
                  Send via WhatsApp
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
