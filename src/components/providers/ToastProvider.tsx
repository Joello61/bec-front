'use client';

import { useState, useEffect } from 'react';
import { ToastContainer } from '@/components/common';
import type { ToastType } from '@/components/common/Toast';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<Toast>;
      setToasts((prev) => [...prev, customEvent.detail]);
    };

    window.addEventListener('show-toast', handleShowToast);

    return () => {
      window.removeEventListener('show-toast', handleShowToast);
    };
  }, []);

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return <ToastContainer toasts={toasts} onClose={handleClose} />;
}