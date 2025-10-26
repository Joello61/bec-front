import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements temps réel liés à la messagerie (messages & conversations)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleMessageEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    
    case EventType.MESSAGE_SENT:
      stable.refetchMessageCount?.();
      stable.refetchConvs?.();

      // On ne notifie pas l’expéditeur
      if (data.expediteurId !== stable.userId) {
        const senderName = data.expediteur?.prenom || 'Un utilisateur';
        const contentPreview = data.contenu?.substring(0, 80) || 'Nouveau message reçu';

        displayNotification(
          stable,
          data.titre ?? 'Nouveau message',
          data.message ?? `${senderName}: ${contentPreview}`,
          `${ROUTES.CONVERSATION(data.conversationId ?? '')}`
        );
      }
      break;

    case EventType.MESSAGE_READ:
      stable.refetchMessageCount?.();
      stable.refetchConvs?.();
      // Pas de notification visuelle ici
      break;

    case EventType.MESSAGE_DELETED:
      stable.refetchConvs?.();
      displayNotification(
        stable,
        data.titre ?? 'Message supprimé',
        data.message ?? 'Un message a été supprimé dans une de vos conversations.'
      );
      break;

    case EventType.CONVERSATION_CREATED:
      stable.refetchConvs?.();
      displayNotification(
        stable,
        data.titre ?? 'Nouvelle conversation',
        data.message ?? 'Une nouvelle conversation a été ouverte.',
        `${ROUTES.CONVERSATION(data.conversationId ?? '')}`
      );
      break;

    case EventType.CONVERSATION_DELETED:
      stable.refetchConvs?.();
      displayNotification(
        stable,
        data.titre ?? 'Conversation supprimée',
        data.message ?? 'Une de vos conversations a été supprimée.'
      );
      break;

    default:
      break;
  }
};
