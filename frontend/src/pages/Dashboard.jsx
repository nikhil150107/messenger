import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, RefreshCw, LogOut, Quote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-sky-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">Messenger</span>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-500 transition-colors cursor-pointer">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quote of the Day</h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Get inspired. Share with your friends on WhatsApp.</p>
          </div>

          <div className="bg-white border border-sky-200 rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-400" />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
                <p className="text-slate-400 text-sm font-medium">Loading quote...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-rose-500 text-sm font-medium mb-4">{error}</p>
                <button onClick={() => fetchQuote()} className="text-sky-600 font-semibold text-sm hover:underline">
                  Try again
                </button>
              </div>
            ) : quote ? (
              <div className="flex flex-col items-center text-center gap-6">
                <Quote className="w-10 h-10 text-sky-300" />
                <blockquote className="text-xl font-semibold text-slate-800 leading-relaxed">
                  "{quote.text}"
                </blockquote>
                <p className="text-sky-500 font-bold text-sm tracking-wide uppercase">— {quote.author}</p>

                <div className="flex gap-3 w-full pt-2">
                  <button onClick={handleShareWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3 px-5 rounded-xl transition-colors cursor-pointer">
                    <WhatsAppIcon /> Share on WhatsApp
                  </button>
                  <button onClick={() => fetchQuote(true)} disabled={isRefreshing}
                    className="flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 font-bold text-sm py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> New
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
