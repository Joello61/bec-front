'use client';

import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from './NotificationItem';
import { Button } from '@/components/ui';
import type { AppNotification } from '@/types';

interface NotificationListProps {
  notifications: AppNotification[];
  onNotificationClick?: (notification: AppNotification) => void;
  onDismiss?: (id: number) => void;
  onMarkAllAsRead?: () => void;
  isLoading?: boolean;
}

export default function NotificationList({
  notifications,
  onNotificationClick,
  onDismiss,
  onMarkAllAsRead,
  isLoading = false,
}: NotificationListProps) {
  const hasUnread = notifications.some((n) => !n.lue);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 rounded-lg animate-pulse flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucune notification
        </h3>
        <p className="text-gray-600">
          Vous êtes à jour ! Revenez plus tard.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      {hasUnread && onMarkAllAsRead && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
            Tout marquer comme lu
          </Button>
        </div>
      )}

      {/* List */}
      <AnimatePresence mode="popLayout">
        <div className="space-y-5">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => onNotificationClick?.(notification)}
              onDismiss={onDismiss ? () => onDismiss(notification.id) : undefined}
            />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}