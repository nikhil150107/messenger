import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const PasswordInput = ({ label, id, error, value = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

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
    </div>
  );
};

export default PasswordInput;
