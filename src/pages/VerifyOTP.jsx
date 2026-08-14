import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MessageSquare, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import OTPInput from '../components/OTPInput';
import Button from '../components/Button';
import { authAPI } from '../services/api';

const VerifyOTP = () => {
  const location = useLocation();
  
  // Extract state if available, otherwise use mock
  const rawMobile = location.state?.mobileNumber || '+919876543210';
  const userId = location.state?.userId || '';
  
  // Mask the mobile number (e.g., +91 ******3210)
  const maskMobile = (number) => {
    if (!number || number.length < 5) return number;
    const last4 = number.slice(-4);
    const prefix = number.slice(0, number.length - 10) || number.slice(0, 3); // grab country code roughly
    return `${prefix} ******${last4}`;
  };

  const maskedNumber = maskMobile(rawMobile);

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  // Timer logic for resend button
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    setError('');
    setResendMessage('');

    if (!userId) {
      setError('User ID not found. Please try registering again.');
      setIsResending(false);
      return;
    }

    try {
      const response = await authAPI.resendOtp(userId);
      if (response.success) {
        setResendMessage(response.message || 'OTP sent successfully.');
        setTimer(30);
        setCanResend(false);
      } else {
        setError('Unable to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('Unable to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const getErrorMessage = (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message?.toLowerCase() || '';
    
    if (status === 400 || message.includes('invalid') || message.includes('incorrect')) {
      return 'Invalid OTP. Please try again.';
    }
    if (status === 410 || message.includes('expire')) {
      return 'OTP has expired. Please request a new OTP.';
    }
    if (status === 429 || message.includes('too many') || message.includes('limit')) {
      return 'Too many attempts. Please try again later.';
    }
    if (status >= 500) {
      return 'Server error. Please try again later.';
    }
    return 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setResendMessage('');

    if (!otp || otp.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    if (!userId) {
      setError('User ID not found. Please try registering again.');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authAPI.verifyOtp(userId, otp);
      
      if (response.success || response.token) {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        setIsSuccess(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete</h2>
            <p className="text-gray-500 mb-8">Mobile number verified successfully.</p>
            
            <Button onClick={() => alert('Future navigation to Messenger')} fullWidth>
              Continue to Messenger
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Branding */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <MessageSquare className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">Messenger</span>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Verify Your Mobile Number</h2>
            <p className="text-gray-500 text-sm">
              We have sent a 6-digit OTP to your mobile number.
            </p>
            <div className="mt-2 font-medium text-gray-800 bg-gray-50 py-2 px-4 rounded-lg inline-block">
              {maskedNumber}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resendMessage && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              <span>{resendMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <OTPInput 
                length={6} 
                onChange={(value) => {
                  setOtp(value);
                  if (error) setError('');
                }}
                onComplete={(value) => {
                  // Optional auto-submit can be implemented here
                }}
              />
            </div>

            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center flex flex-col gap-4">
              <div className="text-sm">
                <span className="text-gray-500">Didn't receive the OTP? </span>
                {canResend ? (
                  <button 
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 mx-auto mt-2"
                  >
                    <RefreshCw size={14} className={isResending ? "animate-spin" : ""} />
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </button>
                ) : (
                  <span className="font-medium text-gray-400 mt-2 block">
                    Resend OTP in <span className="text-gray-600">{timer}s</span>
                  </span>
                )}
              </div>
              
              <Link 
                to="/signup" 
                className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Registration
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
