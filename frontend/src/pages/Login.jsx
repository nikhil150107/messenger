import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MessageSquare, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

export default function Login() {
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI & Validation State
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Alert Modal State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    primaryText: 'OK',
    onPrimaryAction: null
  });

  // Frontend Email Regex Format Validator
  const isValidEmail = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Reset previous errors
    const newErrors = { email: '', password: '' };
    let hasError = false;

    // Email Empty & Format Validation
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
      hasError = true;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com)';
      hasError = true;
    }

    // Password Empty Validation
    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    // 2. Start Loading simulation
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // 3. Show Success Alert Notification
      setAlertConfig({
        isOpen: true,
        title: 'Login Successful',
        message: `Welcome back! You have successfully logged in as ${email.trim()}.`,
        type: 'success',
        primaryText: 'Close',
        onPrimaryAction: () => {
          setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        }
      });
    }, 700);
  };



  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-sky-50 text-slate-800">
      {/* Main Centered Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-sky-200 rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          {/* Plain Light Blue Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-400" />

          {/* Messenger Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sky-400 flex items-center justify-center shadow-xs mb-4">
              <MessageSquare className="w-9 h-9 text-white fill-white/20" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Messenger
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1.5">
              Connect. Chat. Stay Connected.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <Input
              id="login-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="Enter your email"
              error={errors.email}
              leftIcon={<Mail className="w-5 h-5 text-slate-400" />}
              autoComplete="email"
              required
            />

            {/* Password Field with Eye Icon Toggle */}
            <Input
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Enter your password"
              error={errors.password}
              leftIcon={<Lock className="w-5 h-5 text-slate-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="p-1 rounded-lg hover:bg-sky-50 transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              autoComplete="current-password"
              required
            />

            {/* Full-width Login Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Login
              </Button>
            </div>
          </form>

          {/* New User Option */}
          <div className="mt-8 pt-6 border-t border-sky-100 text-center">
            <p className="text-sm font-semibold text-slate-500">
              New user?{' '}
              <Link
                to="/signup"
                className="text-sky-600 hover:text-sky-700 font-bold transition-colors hover:underline underline-offset-4 cursor-pointer outline-none"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Alert Modal Component */}
      <Alert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        primaryText={alertConfig.primaryText}
        onPrimaryAction={alertConfig.onPrimaryAction}
        onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
