'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface InAppNotificationProps {
  id: string;
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
  onClose: (id: string) => void;
}

export function InAppNotification({
  id,
  title,
  message,
  icon = <Bell className="w-5 h-5 text-primary" />,
  duration = 6000,
  onClose,
}: InAppNotificationProps) {
  useEffect(() => {
    console.log('[Notif] affichée →', id);

    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return createPortal(
    <motion.div
      layout
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      className={`
        fixed bottom-2 right-2 z-[999999] w-full max-w-sm
        bg-white rounded-lg shadow-lg border border-gray-200
        p-4 flex items-start gap-3 pointer-events-auto mb-4
      `}
    >
      <div className="flex-shrink-0 pt-0.5">{icon}</div>

      <div className="flex-1 w-0">
        <p className="font-semibold text-sm text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1 break-words">{message}</p>
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 -mr-1 -mt-1 hover:bg-gray-100 rounded p-1 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </motion.div>,
    document.body
  );
}
