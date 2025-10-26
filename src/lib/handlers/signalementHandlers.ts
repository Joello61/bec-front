import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements liés aux signalements (création, traitement, rejet)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleSignalementEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    
    case EventType.SIGNALEMENT_CREATED:
      // Admins → nouveau signalement à examiner
      if (stable.isAdmin) {
        stable.refetchSignalements?.();
        displayNotification(
          stable,
          data.titre ?? 'Nouveau signalement reçu',
          data.message ?? `Un utilisateur a signalé un contenu (ID: ${data.entityId ?? 'inconnu'}).`,
        );
      }

      // Auteur du signalement → confirmation
      if (data.auteurId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Signalement envoyé',
          data.message ?? 'Votre signalement a bien été enregistré. L’équipe va l’examiner sous peu.',
          ROUTES.SIGNALEMENTS
        );
      }
      break;

    case EventType.SIGNALEMENT_HANDLED:
      // Admin → maj des stats
      if (stable.isAdmin) {
        stable.refetchSignalements?.();
      }

      // Auteur → notification de résolution
      if (data.auteurId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Signalement traité',
          data.message ??
            'Votre signalement a été traité par l’équipe de modération. Merci pour votre vigilance.',
          ROUTES.SIGNALEMENTS
        );
      }

      // Utilisateur signalé → avertissement éventuel
      if (data.utilisateurSignaleId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Signalement à votre encontre',
          data.message ??
            'Un signalement vous concernant a été examiné et validé. Merci de respecter les règles de la plateforme.',
          ROUTES.PROFILE
        );
      }
      break;

    case EventType.SIGNALEMENT_REJECTED:
      // Auteur → notification du rejet
      if (data.auteurId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Signalement rejeté',
          data.message ?? 'Votre signalement a été examiné, mais jugé non fondé.',
          ROUTES.SIGNALEMENTS
        );
      }

      // Admin → rafraîchir la liste des signalements
      if (stable.isAdmin) {
        stable.refetchSignalements?.();
      }
      break;

    default:
      break;
  }
};
