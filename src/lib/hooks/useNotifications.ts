/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import { useNotificationStore } from '@/lib/store';

/**
 * Hook pour gérer les notifications
 */
export function useNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const error = useNotificationStore((state) => state.error);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationStore((state) => state.deleteNotification);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const refetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  };
}

/**
 * Hook pour les notifications non lues
 */
export function useUnreadNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const fetchUnread = useNotificationStore((state) => state.fetchUnread);

  useEffect(() => {
    fetchUnread();
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.lue);

  return {
    unreadNotifications,
    refetch: fetchUnread,
  };
}

/**
 * Hook pour le compteur de notifications non lues
 */
export function useUnreadNotificationCount(isAuthenticated?: boolean) {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const fetchUnreadCount = useNotificationStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchUnreadCount();
  }, [isAuthenticated, fetchUnreadCount]);

  const refetch = useCallback(() => {
    if (!isAuthenticated) return;

    fetchUnreadCount();
  }, [isAuthenticated, fetchUnreadCount]);

  return {
    unreadCount: isAuthenticated ? unreadCount : 0,
    refetch,
  };
}
