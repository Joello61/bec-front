import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements temps réel destinés aux administrateurs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAdminEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    
    case EventType.ADMIN_STATS_UPDATED:
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Statistiques mises à jour',
        data.message ?? 'Les statistiques globales du tableau de bord ont été actualisées.',
        ROUTES.ADMIN_DASHBOARD
      );
      break;

    case EventType.ADMIN_USER_BANNED:
      if (stable.isAdmin) stable.refetchUsers?.();
      displayNotification(
        stable,
        data.titre ?? 'Utilisateur banni',
        data.message ?? `Un utilisateur (ID: ${data.userId ?? 'inconnu'}) a été banni.`,
        ROUTES.ADMIN_USERS
      );
      break;

    case EventType.ADMIN_USER_DELETED:
      if (stable.isAdmin) stable.refetchUsers?.();
      displayNotification(
        stable,
        data.titre ?? 'Utilisateur supprimé',
        data.message ?? `Un utilisateur (ID: ${data.userId ?? 'inconnu'}) a été supprimé.`,
        ROUTES.ADMIN_USERS
      );
      break;

    case EventType.ADMIN_NOTIFICATION_SENT:
      displayNotification(
        stable,
        data.titre ?? 'Notification administrateur',
        data.message ?? 'Un message d’administration vous a été envoyé.',
        ROUTES.NOTIFICATIONS
      );
      stable.refetchNotif?.();
      break;

    case EventType.ADMIN_WARNING_SENT:
      displayNotification(
        stable,
        data.titre ?? 'Avertissement de l’administration',
        data.message ??
          'Vous avez reçu un avertissement concernant votre activité sur la plateforme.',
        ROUTES.PROFILE
      );
      stable.refetchNotif?.();
      break;

    default:
      break;
  }
};
