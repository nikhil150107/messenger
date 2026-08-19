import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

const Select = ({ label, id, error, options, value, icon: Icon, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <select
          id={id}
          value={value}
          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all ${
            Icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-blue-500'
          }`}
          {...props}
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value} disabled={opt.disabled} hidden={opt.disabled}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          {error ? <AlertCircle size={18} className="text-red-500" /> : <ChevronDown size={18} />}
        </div>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
