'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
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

export function Toast({ id, type, message, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-50 min-w-[300px] max-w-md rounded-lg shadow-lg ${toastStyles[type]} p-4 flex items-start gap-3`}
    >
      <div className="flex-shrink-0 mt-0.5">{toastIcons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
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

// Toast Container pour gérer plusieurs toasts
interface ToastContainerProps {
  toasts: Array<{ id: string; type: ToastType; message: string; duration?: number }>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <motion.div
          key={toast.id}
          style={{ top: `${4 + index * 80}px` }}
          className="fixed right-4 z-50"
        >
          <Toast {...toast} onClose={onClose} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// Hook pour utiliser les toasts facilement
let toastId = 0;

export function useToast() {
  const showToast = (type: ToastType, message: string, duration?: number) => {
    const id = `toast-${toastId++}`;
    // Dispatcher un événement custom pour que le ToastContainer puisse l'écouter
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { id, type, message, duration },
      })
    );
  };

  return {
    success: (message: string, duration?: number) => showToast('success', message, duration),
    error: (message: string, duration?: number) => showToast('error', message, duration),
    warning: (message: string, duration?: number) => showToast('warning', message, duration),
    info: (message: string, duration?: number) => showToast('info', message, duration),
  };
}