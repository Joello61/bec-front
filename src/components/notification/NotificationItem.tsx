'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Star, Package, FileText, X } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Notification, NotificationType } from '@/types';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
  onDismiss?: () => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  matching_voyage: <Package className="w-5 h-5" />,
  matching_demande: <FileText className="w-5 h-5" />,
  new_message: <MessageCircle className="w-5 h-5" />,
  avis_recu: <Star className="w-5 h-5" />,
  voyage_statut: <Package className="w-5 h-5" />,
  demande_statut: <FileText className="w-5 h-5" />,
};

const notificationColors: Record<NotificationType, string> = {
  matching_voyage: 'bg-primary/10 text-primary',
  matching_demande: 'bg-secondary/10 text-secondary',
  new_message: 'bg-info/10 text-info',
  avis_recu: 'bg-warning/10 text-warning',
  voyage_statut: 'bg-primary/10 text-primary',
  demande_statut: 'bg-secondary/10 text-secondary',
};

export default function NotificationItem({ notification, onClick, onDismiss }: NotificationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        'p-4 flex items-start gap-3 rounded-lg transition-colors cursor-pointer',
        !notification.lue ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-gray-50'
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', notificationColors[notification.type])}>
        {notificationIcons[notification.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={cn('text-sm font-medium', !notification.lue && 'text-gray-900')}>
              {notification.titre}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
          </div>
          {!notification.lue && (
            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatDateRelative(notification.createdAt)}
        </p>
      </div>

      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
          aria-label="Supprimer"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </motion.div>
  );
}