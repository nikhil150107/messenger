import React from 'react';

/**
 * Plain Light Blue Messenger Action Button
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label / content
 * @param {Function} [props.onClick] - Click handler
 * @param {'button'|'submit'|'reset'} [props.type='button'] - HTML button type
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant='primary'] - Button design variant
 * @param {boolean} [props.isLoading=false] - Show loading spinner state
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.fullWidth=true] - Expand button width to 100%
 * @param {React.ReactNode} [props.icon=null] - Icon on left of text
 * @param {string} [props.className=''] - Extra Tailwind CSS classes
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = true,
  icon = null,
  className = '',
  ...rest
}) {
  // Base styling rules
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-bold text-sm rounded-xl py-3.5 px-5
    transition-colors duration-150 cursor-pointer outline-none select-none
    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
    active:scale-[0.98]
  `;

  // Plain Light Blue Theme Variant Mappings
  const variantClasses = {
    primary: `
      bg-sky-400 hover:bg-sky-500 text-white shadow-xs border border-sky-400
      focus:ring-2 focus:ring-sky-200
    `,
    secondary: `
      bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-200
      focus:ring-2 focus:ring-sky-100
    `,
    outline: `
      bg-white border-2 border-sky-300 hover:bg-sky-50 text-sky-700
      focus:ring-2 focus:ring-sky-200
    `,
    ghost: `
      bg-transparent hover:bg-sky-100/60 text-slate-600 hover:text-sky-700
      focus:ring-2 focus:ring-sky-200
    `,
    danger: `
      bg-rose-500 hover:bg-rose-600 text-white shadow-xs border border-rose-500
      focus:ring-2 focus:ring-rose-200
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variantClasses[variant] || variantClasses.primary}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
