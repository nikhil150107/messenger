import React from 'react';
import { Phone, AlertCircle } from 'lucide-react';

const PhoneInput = ({ label, id, error, countryCallingCode, value, onChange, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex">
        <div className="absolute inset-y-0 left-0 pl-3 z-10 flex items-center pointer-events-none text-gray-400">
          <Phone size={18} />
        </div>
        <div className={`flex items-center pl-10 pr-3 py-2.5 bg-gray-100 border border-r-0 rounded-l-lg text-gray-600 font-medium ${error ? 'border-red-300' : 'border-gray-200'}`}>
          {countryCallingCode ? `+${countryCallingCode}` : '+--'}
        </div>
        <input
          id={id}
          type="tel"
          value={value}
          onChange={onChange}
          className={`flex-1 min-w-0 px-4 py-2.5 bg-gray-50 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-blue-500'
          }`}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle size={18} className="text-red-500" />
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PhoneInput;
