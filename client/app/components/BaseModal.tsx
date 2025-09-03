'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-[560px]',
  showCloseButton = true,
}: BaseModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock background scroll + focus trap entry
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div
          ref={panelRef}
          tabIndex={-1}
          className={`w-full ${maxWidth} max-h-[90vh] rounded-lg bg-white shadow-2xl outline-none flex flex-col`}
        >
          {/* header */}
          <div className="relative px-5 py-4 sm:px-6 flex-shrink-0">
            <h2 id="modal-title" className="text-xl font-semibold text-raisin">
              {title}
            </h2>
            {showCloseButton && (
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full p-2 text-raisin/70 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* scrollable content */}
          <div className="px-5 sm:px-6 pb-2 overflow-y-auto flex-1 min-h-0">
            {children}
          </div>

          {/* footer */}
          {footer && (
            <div className="px-5 sm:px-6 py-4 flex-shrink-0 border-t">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
