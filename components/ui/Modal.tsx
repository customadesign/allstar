'use client';

import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initialFocusSelector?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  initialFocusSelector,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const titleId = 'modal-title';
  const descId = subtitle ? 'modal-description' : undefined;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    // Focus management on open
    const focusTarget =
      (initialFocusSelector && document.querySelector(initialFocusSelector) as HTMLElement | null) ||
      closeBtnRef.current;

    focusTarget?.focus();

    // Prevent background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, initialFocusSelector]);

  if (!isOpen) return null;

  const sizeClass =
    size === 'sm' ? 'max-w-md' :
    size === 'lg' ? 'max-w-3xl' :
    size === 'xl' ? 'max-w-5xl' :
    'max-w-xl';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby={titleId}
      aria-describedby={descId}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) {
          onClose();
        }
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Dialog */}
      <div className={`relative bg-white w-full ${sizeClass} rounded-xl shadow-lg ring-1 ring-black/10 focus:outline-none`}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-start justify-between">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p id={descId} className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="ml-4 inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Close dialog"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.415 1.414L11.415 10l4.293 4.293a1 1 0 01-1.414 1.415L10 11.415l-4.293 4.293a1 1 0 01-1.415-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}