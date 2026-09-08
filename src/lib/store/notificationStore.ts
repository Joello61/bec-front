import { create } from 'zustand';
import { notificationsApi } from '@/lib/api/notifications';
import { createAsyncAction } from './createAsyncAction';
import type { ApiError, AppNotification } from '@/types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: () => Promise<void>;
  fetchUnread: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: () =>
    createAsyncAction(set, async () => {
      const notifications = await notificationsApi.list();
      set({ notifications, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des notifications' }),

  fetchUnread: () =>
    createAsyncAction(set, async () => {
      const notifications = await notificationsApi.getUnread();
      set({ notifications, isLoading: false });
    }, { fallbackError: 'Erreur lors du chargement des notifications' }),

  // Compteur silencieux : ne pilote pas isLoading/error, comme authStore.checkProfileStatus.
  fetchUnreadCount: async () => {
    try {
      const unreadCount = await notificationsApi.getUnreadCount();
      set({ unreadCount });
    } catch (error) {
      console.log('Erreur lors du chargement du compteur de notifications non lues', error);
    }
  },

  // Ne pilote pas isLoading (comportement d'origine) - hors du helper.
  markAsRead: async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif.id === id ? { ...notif, lue: true } : notif
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }));
    } catch (error) {
      set({ error: (error as ApiError).message });
    }
  },

  markAllAsRead: () =>
    createAsyncAction(set, async () => {
      await notificationsApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((notif) => ({ ...notif, lue: true })),
        unreadCount: 0,
        isLoading: false
      }));
    }, { fallbackError: 'Erreur lors du marquage des notifications' }),

  // Ne pilote pas isLoading (comportement d'origine) - hors du helper.
  deleteNotification: async (id) => {
    try {
      await notificationsApi.delete(id);
      set((state) => {
        const notification = state.notifications.find((n) => n.id === id);
        const wasUnread = notification && !notification.lue;

        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
        };
      });
    } catch (error) {
      set({ error: (error as ApiError).message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({
    notifications: [],
    unreadCount: 0,
    error: null
  }),
}));
