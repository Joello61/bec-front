import { useEffect, useState } from 'react';

import { logger } from '@/lib/utils/logger';

type PermissionStatus = NotificationPermission | null;


export function useRequestNotificationPermission(): PermissionStatus {
  const [permission, setPermission] = useState<PermissionStatus>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return null;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      if (typeof window !== 'undefined') {
        logger.warn('Notifications non supportées par ce navigateur.');
        if (permission !== 'denied') setPermission('denied');
      }
      return;
    }

    if (Notification.permission === 'default') {
      logger.log('Demande de permission pour les notifications...');
      Notification.requestPermission()
        .then((p) => {
          setPermission(p);
          if (p === 'granted') logger.log('Permission Notification accordée.');
          else if (p === 'denied') logger.warn('Permission Notification refusée.');
          else logger.log('Permission Notification ignorée (défaut).');
        })
        .catch((err) => {
          logger.error("Erreur lors de la demande de permission:", err);
          setPermission('denied');
        });
    } else {
      if (permission !== Notification.permission) {
        setPermission(Notification.permission);
      }
      if (Notification.permission === 'granted') logger.log('Permission Notification déjà accordée.');
      if (Notification.permission === 'denied') logger.warn('Permission Notification précédemment refusée.');
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission;
}