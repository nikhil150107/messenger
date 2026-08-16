import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import OTPInput from '../components/OTPInput';
import Button from '../components/Button';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId || '';
  const email = location.state?.email || '';

  const maskEmail = (e) => {
    if (!e) return '';
    const [user, domain] = e.split('@');
    return `${user.slice(0, 2)}${'*'.repeat(Math.max(user.length - 2, 3))}@${domain}`;
  };

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    if (!userId) navigate('/signup', { replace: true });
  }, [userId, navigate]);

  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend || isResending) return;
    setIsResending(true);
    setError('');
    setResendMessage('');
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/resend-otp`, { userId });
      if (data.success) {
        setResendMessage('OTP resent successfully.');
        setTimer(30);
        setCanResend(false);
      } else {
        setError('Unable to resend OTP. Please try again.');
      }
    } catch {
      setError('Unable to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setResendMessage('');

    if (!otp || otp.length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/verify-otp`, { userId, otp });
      if (data.success) {
        setIsSuccess(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message?.toLowerCase() || '';
      if (status === 410 || msg.includes('expire')) setError('OTP has expired. Please request a new one.');
      else if (msg.includes('invalid')) setError('Invalid OTP. Please try again.');
      else setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-8 shadow-xl rounded-2xl border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-8">Your account is ready. Please login to continue.</p>
            <Button onClick={() => navigate('/login', { replace: true })} fullWidth>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">Messenger</span>
        </div>

        <div className="bg-white py-8 px-8 shadow-xl rounded-2xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Email</h2>
            <p className="text-gray-500 text-sm">We sent a 6-digit OTP to</p>
            <div className="mt-2 font-semibold text-gray-800 bg-gray-50 py-2 px-4 rounded-lg inline-block">
              {maskEmail(email)}
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" /><span>{error}</span>
            </div>
          )}
          {resendMessage && (
            <div className="mb-5 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex items-center gap-2">
              <CheckCircle2 size={16} className="flex-shrink-0" /><span>{resendMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <OTPInput length={6} onChange={(val) => { setOtp(val); if (error) setError(''); }} />
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
            <div className="text-sm text-gray-500">
              Didn't receive the OTP?{' '}
              {canResend ? (
                <button onClick={handleResend} disabled={isResending}
                  className="font-semibold text-blue-600 hover:text-blue-500 disabled:opacity-50 inline-flex items-center gap-1">
                  <RefreshCw size={13} className={isResending ? 'animate-spin' : ''} />
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              ) : (
                <span className="text-gray-400 font-medium">Resend in <span className="text-gray-600">{timer}s</span></span>
              )}
            </div>
            <Link to="/signup" className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
              <ArrowLeft size={14} /> Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
