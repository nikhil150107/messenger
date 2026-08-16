import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, MessageSquare, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = { email: '', password: '' };
    let hasError = false;

    if (!email.trim()) { newErrors.email = 'Email address is required'; hasError = true; }
    else if (!isValidEmail(email)) { newErrors.email = 'Please enter a valid email address'; hasError = true; }
    if (!password) { newErrors.password = 'Password is required'; hasError = true; }

    setErrors(newErrors);
    if (hasError) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: email.trim(),
        password
      });

      if (data.success && data.accessToken) {
        login(data.accessToken);
        navigate('/dashboard', { replace: true });
      } else {
        setApiError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-sky-50 text-slate-800">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-sky-200 rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-400" />

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sky-400 flex items-center justify-center shadow-xs mb-4">
              <MessageSquare className="w-9 h-9 text-white fill-white/20" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Messenger</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1.5">Connect. Chat. Stay Connected.</p>
          </div>

          {apiError && (
            <div className="mb-5 p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-200 font-medium">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              id="login-email" label="Email" type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
              placeholder="Enter your email" error={errors.email}
              leftIcon={<Mail className="w-5 h-5 text-slate-400" />} autoComplete="email" required
            />
            <Input
              id="login-password" label="Password" type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
              placeholder="Enter your password" error={errors.password}
              leftIcon={<Lock className="w-5 h-5 text-slate-400" />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="p-1 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password" required
            />
            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={isLoading} fullWidth icon={<ArrowRight className="w-4 h-4" />}>
                Login
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-sky-100 text-center">
            <p className="text-sm font-semibold text-slate-500">
              New user?{' '}
              <Link to="/signup" className="text-sky-600 hover:text-sky-700 font-bold transition-colors hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
