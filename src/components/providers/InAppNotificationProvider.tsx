'use client';

import React, { useEffect } from 'react';
import { InAppNotificationContainer } from '@/components/notification/InAppNotificationContainer';
import { useRealTimeNotificationStore } from '@/lib/store/realTimeNotificationStore';
import { logger } from '@/lib/utils/logger';

export function InAppNotificationProvider({ children }: { children: React.ReactNode }) {
  const notifications = useRealTimeNotificationStore((s) => s.realTimeNotifications);
  const removeNotification = useRealTimeNotificationStore((s) => s.removeNotification);
  const clear = useRealTimeNotificationStore((s) => s.clear);

  // Purge à chaque remontée (prévention des rejouées après reconnexion)
  useEffect(() => {
    logger.log('[NotifProvider] Nettoyage des anciennes notifications');
    clear();
  }, [clear]);

  return (
    <>
      {children}
      <InAppNotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </>
  );
}
