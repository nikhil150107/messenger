import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, ChevronDown, Check, Search } from 'lucide-react';

const SearchableSelect = ({ label, id, error, options = [], value, onChange, onBlur, placeholder, disabled, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (isOpen) {
          setIsOpen(false);
          if (onBlur) onBlur({ target: { id, name: id, value } });
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur, id, value]);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="w-full" ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <div 
          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:bg-gray-100'
          } ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-200 focus:border-blue-500'
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center truncate">
            {Icon && <Icon size={18} className="text-gray-400 mr-2 flex-shrink-0" />}
            <span className={`truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          {error ? <AlertCircle size={18} className="text-red-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
        </div>
        
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 flex flex-col">
            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`px-3 py-2 text-sm rounded-md cursor-pointer flex items-center justify-between ${
                      value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                      if (onBlur) onBlur({ target: { id, name: id, value: opt.value } });
                    }}
                  >
                    <span className="truncate">{opt.label}</span>
                    {value === opt.value && <Check size={16} className="text-blue-600 flex-shrink-0" />}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-center text-gray-500">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
