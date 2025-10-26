'use client';

import { useRealTimeNotificationStore } from '@/lib/store/realTimeNotificationStore';

let notifCounter = 0;

export function useInAppNotification() {
  const addNotification = useRealTimeNotificationStore((s) => s.addNotification);

  const showNotification = (
    title: string,
    message: string,
    options?: { icon?: React.ReactNode; duration?: number }
  ) => {
    const id = `in-app-notif-${Date.now()}-${notifCounter++}`;
    addNotification({
      id,
      title,
      message,
      icon: options?.icon,
      duration: options?.duration ?? 6000,
    });
  };

  return { showNotification };
}
