import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, RefreshCw, LogOut, Quote, Share2, Sparkles, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchQuote = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError('');

    try {
      const { data } = await axios.get(`${BASE_URL}/api/dashboard/quote`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setQuote(data.quote);
      else setError('Failed to load quote.');
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login', { replace: true });
      } else {
        setError('Failed to load quote. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token, logout, navigate]);

  useEffect(() => { fetchQuote(); }, [fetchQuote]);

  const handleShareWhatsApp = () => {
    if (!quote) return;
    const text = encodeURIComponent(`"${quote.text}"\n\n— ${quote.author}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopy = () => {
    if (!quote) return;
    navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 xl:w-72 flex-col bg-slate-900 border-r border-slate-800 h-screen sticky top-0">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Messenger</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-3 cursor-pointer">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-300">Daily Quote</span>
          </div>
          <div className="px-3 py-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors">
            <Share2 className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-500">Share</span>
          </div>
        </nav>

        {/* User card at bottom */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">My Account</p>
              <p className="text-[11px] text-slate-500 truncate">Logged in</p>
            </div>
            <button onClick={handleLogout} title="Logout"
              className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-700">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">Messenger</span>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">

          {/* Greeting */}
          <div className="mb-8">
            <p className="text-slate-500 text-sm font-medium">{getGreeting()} 👋</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">Your Daily Inspiration</h1>
          </div>

          <div className="max-w-2xl">

            {/* Quote Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-indigo-500/15 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Quote of the Day</span>
                </div>
                <button
                  onClick={() => fetchQuote(true)}
                  disabled={isRefreshing || isLoading}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-400 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  New quote
                </button>
              </div>

              {/* Card body */}
              <div className="px-6 py-8">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                    <p className="text-slate-500 text-sm">Fetching your quote...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <p className="text-slate-500 text-sm mb-4">{error}</p>
                    <button onClick={() => fetchQuote()}
                      className="text-indigo-400 font-semibold text-sm hover:underline underline-offset-4 cursor-pointer">
                      Try again
                    </button>
                  </div>
                ) : quote ? (
                  <div>
                    {/* Large quote mark */}
                    <Quote className="w-10 h-10 text-indigo-500/20 mb-4" />

                    <blockquote className="text-xl md:text-2xl font-semibold text-white leading-relaxed mb-6">
                      "{quote.text}"
                    </blockquote>

                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-px flex-1 bg-slate-800" />
                      <p className="text-indigo-400 font-bold text-sm tracking-wide">— {quote.author}</p>
                      <div className="h-px flex-1 bg-slate-800" />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleShareWhatsApp}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3 px-5 rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
                      >
                        <WhatsAppIcon /> Share on WhatsApp
                      </button>
                      <button
                        onClick={handleCopy}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold text-sm py-3 px-5 rounded-xl transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <><svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
                        ) : (
                          <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Tip card */}
            <div className="mt-4 flex items-start gap-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl px-4 py-3.5">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                A new quote is served every time you click <span className="text-indigo-400 font-semibold">New quote</span>. Share it with your contacts directly on WhatsApp or copy it to your clipboard.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
