'use client';

import { create } from 'zustand';

export interface RealTimeNotificationData {
  id: string;
  title: string;
  message: string;
  icon?: React.ReactNode;
  duration?: number;
}

interface RealTimeNotificationState {
  realTimeNotifications: RealTimeNotificationData[];
  addNotification: (n: RealTimeNotificationData) => void;
  removeNotification: (id: string) => void;
  clear: () => void;
}

export const useRealTimeNotificationStore = create<RealTimeNotificationState>((set) => ({
  realTimeNotifications: [],

  addNotification: (n) =>
    set((state) => {
      // éviter doublons
      const exists = state.realTimeNotifications.some((notif) => notif.id === n.id);
      if (exists) return state;

      console.log('[Store] addNotification reçu :', n);

      // suppression automatique après duration
      if (n.duration && n.duration > 0) {
        setTimeout(() => {
          set((s) => ({
            realTimeNotifications: s.realTimeNotifications.filter((notif) => notif.id !== n.id),
          }));
        }, n.duration);
      }

      return {
        realTimeNotifications: [...state.realTimeNotifications, n],
      };
    }),

  removeNotification: (id) =>
    set((state) => ({
      realTimeNotifications: state.realTimeNotifications.filter((notif) => notif.id !== id),
    })),

  clear: () => {
    console.log('[Store] clear() → purge totale des notifications');
    set({ realTimeNotifications: [] });
  },
}));
