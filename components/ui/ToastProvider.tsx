'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number; // auto-dismiss; default 4000
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastItem extends Required<Pick<ToastOptions, 'title' | 'variant'>> {
  id: string;
  description?: string;
  durationMs: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  showToast: (opts: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const queueRef = useRef<ToastItem[]>([]);

  const showToast = useCallback((opts: ToastOptions) => {
    const toast: ToastItem = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: opts.title,
      description: opts.description,
      variant: opts.variant ?? 'info',
      durationMs: opts.durationMs ?? 4000,
      actionLabel: opts.actionLabel,
      onAction: opts.onAction,
    };
    setToasts((prev) => [...prev, toast]);
  }, []);

  // Auto dismiss handler
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, t.durationMs)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  // Subscribe to analytics events (optional: debug surface)
  useEffect(() => {
    const onEvt = (e: Event) => {
      // No-op; reserved for future debug toast
      void e;
    };
    window.addEventListener('analytics:event', onEvt as EventListener);
    return () => window.removeEventListener('analytics:event', onEvt as EventListener);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const variantStyles: Record<ToastVariant, string> = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-gray-900 text-white',
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Region */}
      <div
        className="fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 p-3 pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-full max-w-md rounded-lg shadow-lg ring-1 ring-black/10 ${variantStyles[t.variant]}`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-semibold">{t.title}</p>
                  {t.description && (
                    <p className="mt-1 text-sm opacity-90">{t.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {t.actionLabel && (
                    <button
                      onClick={() => {
                        t.onAction?.();
                        setToasts((prev) => prev.filter((x) => x.id !== t.id));
                      }}
                      className="inline-flex items-center rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                    >
                      {t.actionLabel}
                    </button>
                  )}
                  <button
                    onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                    aria-label="Dismiss notification"
                    className="inline-flex items-center rounded-md bg-white/10 p-1 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.415 1.414L11.415 10l4.293 4.293a1 1 0 01-1.414 1.415L10 11.415l-4.293 4.293a1 1 0 01-1.415-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): (opts: ToastOptions) => void {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.showToast;
}