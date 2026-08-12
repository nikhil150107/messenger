import React from 'react';

/**
 * Modern Accessible Form Input Component - Plain Light Blue Theme Edition
 * @param {Object} props
 * @param {string} props.id - Input ID
 * @param {string} props.label - Field label text
 * @param {string} [props.type='text'] - HTML input type
 * @param {string} [props.value=''] - Controlled input value
 * @param {Function} props.onChange - Change handler
 * @param {string} [props.placeholder=''] - Input placeholder
 * @param {string} [props.error=''] - Error message to render
 * @param {React.ReactNode} [props.leftIcon] - Icon to place on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon or button to place on the right
 * @param {boolean} [props.required=false] - Required attribute
 * @param {string} [props.autoComplete] - Auto-complete hint
 * @param {string} [props.className] - Additional wrapper classNames
 */
export default function Input({
  id,
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  error = '',
  leftIcon = null,
  rightIcon = null,
  required = false,
  autoComplete = 'off',
  className = '',
  ...rest
}) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between items-center">
          <label
            htmlFor={inputId}
            className="text-xs font-bold uppercase tracking-wider text-slate-700 select-none flex items-center gap-1"
          >
            {label}
            {required && <span className="text-rose-500 font-bold">*</span>}
          </label>
        </div>
      )}

      <div className="relative flex items-center group">
        {/* Left Icon Slot */}
        {leftIcon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors duration-150">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full py-3 px-4 text-sm font-medium rounded-xl transition-colors duration-150
            bg-white text-slate-800 placeholder:text-slate-400
            border outline-none shadow-xs
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${rightIcon ? 'pr-11' : 'pr-4'}
            ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/20'
                : 'border-sky-200 hover:border-sky-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-100'
            }
          `}
          {...rest}
        />

        {/* Right Icon Slot */}
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {error && (
        <p className="text-xs font-semibold text-rose-500 flex items-center gap-1.5 mt-0.5 animate-fadeIn">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
