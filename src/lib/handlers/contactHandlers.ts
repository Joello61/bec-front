import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés au formulaire de contact et au support
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleContactEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    
    case EventType.CONTACT_FORM_SUBMITTED:
      if (stable.isAdmin) {
        stable.refetchContacts?.();
        displayNotification(
          stable,
          data.titre ?? 'Nouveau message de contact',
          data.message ??
            `L’utilisateur ${data.nom ?? 'inconnu'} (${data.email ?? 'n/a'}) a envoyé un message : "${data.sujet ?? 'Sans sujet'}".`,
        );
      }
      break;

    case EventType.CONTACT_MESSAGE_DELETED:
      if (stable.isAdmin) {
        stable.refetchContacts?.();
        displayNotification(
          stable,
          data.titre ?? 'Message supprimé',
          data.message ?? `Le message de ${data.nom ?? 'un utilisateur'} a été supprimé.`,
        );
      }
      break;

    default:
      break;
  }
};
