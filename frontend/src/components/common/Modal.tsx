import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth,
  size = 'md',
}) => {
  const chosenSize = maxWidth || size;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'w-[calc(100vw-24px)] sm:w-[min(620px,calc(100vw-40px))]',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Darkened & Blurred Backdrop */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{
          backgroundColor: 'rgba(7, 18, 35, 0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'backdropFadeIn 180ms ease-out forwards',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Solid Opaque Modal Panel */}
      <div
        className={`relative w-full ${maxWidthClasses[chosenSize] || 'max-w-md'} bg-white text-slate-900 border border-slate-200/90 rounded-2xl sm:rounded-[22px] z-10 overflow-hidden flex flex-col max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-48px)] transition-all`}
        style={{
          boxShadow: '0 24px 70px rgba(15, 23, 42, 0.30)',
          animation: 'modalSlideIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 sm:px-8 sm:pt-7 sm:pb-5 border-b border-slate-100 bg-white shrink-0">
          <div className="space-y-1 pr-2">
            <div className="text-xl sm:text-2xl font-bold text-[#0B1628] tracking-tight leading-snug">
              {title}
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-normal">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#0788C9]/40 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Viewport */}
        <div className="px-6 py-5 sm:px-8 sm:py-6 overflow-y-auto bg-white flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
