'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  href: Route;
}

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: ToastAction;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const toastStyles = {
  success: 'bg-success text-white',
  error: 'bg-error text-white',
  warning: 'bg-warning text-white',
  info: 'bg-info text-white',
};

export function Toast({ id, type, message, duration, action, onClose }: ToastProps) {
  // Un toast porteur d'une action (lien) reste affiche plus longtemps par defaut - le
  // temps de lire le message et de cliquer, pas seulement de le voir disparaitre.
  const effectiveDuration = duration ?? (action ? 8000 : 3000);

  useEffect(() => {
    if (effectiveDuration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, effectiveDuration);

      return () => clearTimeout(timer);
    }
  }, [id, effectiveDuration, onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -100, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        fixed z-[100]
        top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0
        w-[calc(100%-8rem)] max-w-md
        rounded-lg shadow-lg ${toastStyles[type]}
        p-4 flex items-start gap-3
      `}
    >
      <div className="flex-shrink-0 mt-0.5">{toastIcons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium break-words">{message}</p>
        {action && (
          <Link
            href={action.href}
            onClick={() => onClose(id)}
            className="mt-1 inline-block text-sm font-semibold underline hover:no-underline"
          >
            {action.label}
          </Link>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>,
    document.body
  );
}

interface ToastContainerProps {
  toasts: Array<{ id: string; type: ToastType; message: string; duration?: number; action?: ToastAction }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <AnimatePresence mode="sync">
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          style={{ 
            top: `${1 + index * 5}rem`,
            zIndex: 100 - index
          }}
          className="fixed left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 w-[calc(100%-2rem)] max-w-md"
        >
          <Toast {...toast} onClose={onClose} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

let toastId = 0;

export interface ToastOptions {
  duration?: number;
  action?: ToastAction;
}

export function useToast() {
  const showToast = (type: ToastType, message: string, options?: ToastOptions) => {
    const id = `toast-${toastId++}`;
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { id, type, message, duration: options?.duration, action: options?.action },
      })
    );
  };

  return {
    success: (message: string, options?: ToastOptions) => showToast('success', message, options),
    error: (message: string, options?: ToastOptions) => showToast('error', message, options),
    warning: (message: string, options?: ToastOptions) => showToast('warning', message, options),
    info: (message: string, options?: ToastOptions) => showToast('info', message, options),
  };
}