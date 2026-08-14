import React, { useEffect } from 'react';

/**
 * Modern Custom Tailwind Alert / Modal Component - Plain Light Blue Theme Edition
 * Replaces native browser alert() with accessible clean modal dialog
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is active
 * @param {string} props.title - Modal title header
 * @param {string|React.ReactNode} props.message - Modal detail message
 * @param {'error'|'warning'|'success'|'info'} [props.type='error'] - Modal status theme
 * @param {string} [props.primaryText='OK'] - Primary action button text
 * @param {Function} [props.onPrimaryAction] - Primary action callback
 * @param {string} [props.secondaryText] - Optional secondary action text (e.g. 'Cancel')
 * @param {Function} [props.onSecondaryAction] - Secondary action callback
 * @param {Function} props.onClose - Close handler
 */
export default function Alert({
  isOpen,
  title,
  message,
  type = 'error',
  primaryText = 'OK',
  onPrimaryAction,
  secondaryText = '',
  onSecondaryAction,
  onClose
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Theme Config
  const themeConfig = {
    error: {
      badgeBg: 'bg-rose-50 text-rose-600 border-rose-200',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      buttonStyle: 'bg-sky-400 hover:bg-sky-500 text-white'
    },
    warning: {
      badgeBg: 'bg-amber-50 text-amber-600 border-amber-200',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      buttonStyle: 'bg-amber-500 hover:bg-amber-600 text-white'
    },
    success: {
      badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      buttonStyle: 'bg-emerald-500 hover:bg-emerald-600 text-white'
    },
    info: {
      badgeBg: 'bg-sky-50 text-sky-600 border-sky-200',
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      buttonStyle: 'bg-sky-400 hover:bg-sky-500 text-white'
    }
  };

  const currentTheme = themeConfig[type] || themeConfig.error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="
          relative w-full max-w-md bg-white border border-sky-200 rounded-3xl p-6 sm:p-7
          shadow-xl transition-all transform scale-100 z-10 overflow-hidden
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
      >
        <div className="flex flex-col items-center text-center">
          {/* Badge Icon */}
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${currentTheme.badgeBg} mb-4 shadow-xs`}
          >
            {currentTheme.icon}
          </div>

          {/* Title */}
          <h3
            id="alert-dialog-title"
            className="text-xl font-extrabold text-slate-900 tracking-tight mb-2"
          >
            {title}
          </h3>

          {/* Message */}
          <div className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
            {message}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                if (onPrimaryAction) onPrimaryAction();
                else if (onClose) onClose();
              }}
              className={`
                w-full py-3 px-5 text-sm font-bold rounded-xl transition-colors duration-150
                shadow-xs active:scale-[0.98] outline-none cursor-pointer
                ${currentTheme.buttonStyle}
              `}
            >
              {primaryText}
            </button>

            {secondaryText && (
              <button
                type="button"
                onClick={() => {
                  if (onSecondaryAction) onSecondaryAction();
                  else if (onClose) onClose();
                }}
                className="
                  w-full py-3 px-5 text-sm font-bold text-slate-700 hover:text-slate-900
                  bg-sky-50 hover:bg-sky-100 border border-sky-200
                  rounded-xl transition-colors duration-150 active:scale-[0.98] outline-none cursor-pointer
                "
              >
                {secondaryText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
