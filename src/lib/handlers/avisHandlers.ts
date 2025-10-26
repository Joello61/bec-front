import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements liés aux avis entre utilisateurs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAvisEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    
    case EventType.AVIS_CREATED:
      stable.refetchUserAvis?.(stable.userId);
      if (stable.isAdmin) stable.refetchAdminStats?.();

      // Si l’utilisateur est la cible de l’avis
      if (data.cibleId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Nouvel avis reçu',
          data.message ??
            `Vous avez reçu un nouvel avis de ${data.auteur ?? 'un utilisateur'} (note : ${data.note ?? '-'}/5).`,
          `${ROUTES.PROFILE}`
        );
      }

      // Si l’utilisateur est admin (vue modération)
      if (stable.isAdmin) {
        displayNotification(
          stable,
          data.titre ?? 'Nouvel avis ajouté',
          data.message ??
            `Un nouvel avis (ID: ${data.avisId ?? '?'}) a été laissé par ${data.auteur ?? 'inconnu'}.`,
          ROUTES.ADMIN_MODERATION_AVIS
        );
      }
      break;

    case EventType.AVIS_UPDATED:
      stable.refetchUserAvis?.(stable.userId);
      if (stable.isAdmin) stable.refetchAdminStats?.();

      if (data.cibleId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Avis mis à jour',
          data.message ??
            `Un avis que vous aviez reçu a été modifié. Nouvelle note : ${data.note ?? '-'}/5.`,
          `${ROUTES.PROFILE}`
        );
      }

      if (stable.isAdmin) {
        displayNotification(
          stable,
          data.titre ?? 'Avis modifié',
          data.message ?? `L’avis (ID: ${data.avisId ?? '?'}) a été modifié.`,
          ROUTES.ADMIN_MODERATION_AVIS
        );
      }
      break;

    case EventType.AVIS_DELETED:
      stable.refetchUserAvis?.(stable.userId);
      if (stable.isAdmin) stable.refetchAdminStats?.();

      if (data.cibleId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Avis supprimé',
          data.message ?? 'Un avis que vous aviez reçu a été supprimé.',
          `${ROUTES.PROFILE}`
        );
      }

      if (stable.isAdmin) {
        displayNotification(
          stable,
          data.titre ?? 'Avis supprimé',
          data.message ?? `L’avis (ID: ${data.avisId ?? '?'}) a été supprimé.`,
          ROUTES.ADMIN_MODERATION_AVIS
        );
      }
      break;

    default:
      break;
  }
};
