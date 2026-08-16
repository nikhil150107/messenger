import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, User, LogOut, Send, Quote, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import PhoneInput from '../components/PhoneInput';

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Daily Quote
  const quote = {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela"
  };

  useEffect(() => {
    // Check login status on mount
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!mobile || mobile.length < 7) return;

    setIsLoading(true);
    setSuccessMessage('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Quote sent successfully via WhatsApp!');
      setMobile('');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-sky-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-400 rounded-lg flex items-center justify-center shadow-xs">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Messenger</span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
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

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-sky-100/50 border border-sky-100 overflow-hidden relative">
          {/* Top Decorative Banner */}
          <div className="h-2 w-full bg-sky-400" />
          
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-50 rounded-2xl text-sky-500 mb-4">
                <Quote size={24} className="fill-sky-100" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Quote of the Day</h1>
              <p className="text-slate-500 text-sm mt-1">Share some inspiration with friends.</p>
            </div>

            {/* The Quote Card */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 relative">
              <Quote size={40} className="absolute top-4 left-4 text-slate-200/50 -z-0" />
              <p className="text-lg font-medium text-slate-700 italic relative z-10 leading-relaxed text-center">
                "{quote.text}"
              </p>
              <p className="text-sm font-bold text-sky-600 text-center mt-4 uppercase tracking-wide">
                — {quote.author}
              </p>
            </div>

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm font-medium rounded-xl border border-green-100 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Send Quote Form */}
            <form onSubmit={handleSendQuote} className="space-y-4">
              <PhoneInput
                id="mobile"
                label="Send via WhatsApp"
                placeholder="Enter friend's WhatsApp number"
                countryCallingCode=""
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading || !mobile} 
                  fullWidth 
                  icon={<Send size={16} />}
                >
                  {isLoading ? 'Sending...' : 'Send via WhatsApp'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
