import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements liés aux notifications système
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleNotificationEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    
    case EventType.NOTIFICATION_NEW:
      stable.refetchNotif?.();
      stable.refetchNotifCount?.();

      displayNotification(
        stable,
        data.titre ?? data.notification?.titre ?? 'Nouvelle notification',
        data.message ?? data.notification?.message ?? 'Vous avez reçu une nouvelle notification.',
        ROUTES.NOTIFICATIONS
      );
      break;

    case EventType.NOTIFICATION_READ:
      stable.refetchNotif?.();
      stable.refetchNotifCount?.();

      console.log('[Realtime] Notification(s) marquée(s) comme lue(s).');
      break;

    case EventType.NOTIFICATION_DELETED:
      stable.refetchNotif?.();
      stable.refetchNotifCount?.();

      displayNotification(
        stable,
        data.titre ?? 'Notification supprimée',
        data.message ?? 'Une notification a été retirée de votre liste.'
      );
      break;

    default:
      break;
  }
};
