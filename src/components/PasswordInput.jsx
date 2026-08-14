import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const PasswordInput = ({ label, id, error, showRequirements = false, value = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Basic requirements check
  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'Contains uppercase letter' },
    { regex: /[0-9]/, text: 'Contains number' },
    { regex: /[^A-Za-z0-9]/, text: 'Contains special character' },
  ];

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Lock size={18} />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          className={`w-full pl-10 pr-12 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-blue-500'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={14}/>{error}</p>}
      
      {showRequirements && value.length > 0 && (
        <div className="mt-3">
          <div className="flex gap-1 mb-2 h-1.5">
            {[1, 2, 3, 4].map(level => {
              const metCount = requirements.filter(r => r.regex.test(value)).length;
              let bgColor = 'bg-gray-200';
              if (metCount >= level) {
                if (metCount <= 2) bgColor = 'bg-red-500';
                else if (metCount === 3) bgColor = 'bg-yellow-500';
                else bgColor = 'bg-green-500';
              }
              return <div key={level} className={`flex-1 rounded-full ${bgColor} transition-colors duration-300`} />
            })}
          </div>
          <div className="space-y-2">
            {requirements.map((req, idx) => {
              const isMet = req.regex.test(value);
              return (
                <div key={idx} className={`flex items-center text-xs ${isMet ? 'text-green-600' : 'text-gray-400'}`}>
                  {isMet ? <CheckCircle2 size={14} className="mr-1.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current mr-1.5 opacity-50" />}
                  {req.text}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
