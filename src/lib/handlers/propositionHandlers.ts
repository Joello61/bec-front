import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements liés aux propositions entre voyageur et client.
 */
export const handlePropositionEvents = (
  eventType: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  stable: StableContext
) => {
  switch (eventType) {
    
    case EventType.PROPOSITION_CREATED:
      stable.refetchPropositionsVoyage?.(data.voyageId);
      stable.refetchUserDemandes?.(stable.userId);
      stable.refetchUserVoyages?.(stable.userId);

      if (data.voyageurId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Nouvelle proposition reçue',
          data.message ??
            `${data.clientNom || 'Un utilisateur'} a fait une proposition sur votre voyage.`,
          `${ROUTES.MES_VOYAGE_DETAILS(data.voyageId ?? '')}`
        );
      } else if (data.clientId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Proposition envoyée',
          data.message ?? 'Votre proposition a été envoyée avec succès.',
          `${ROUTES.MES_DEMANDE_DETAILS(data.demandeId ?? '')}`
        );
      }
      break;

    case EventType.PROPOSITION_ACCEPTED:
      stable.refetchPropositionsVoyage?.(data.voyageId);

      if (data.clientId === stable.userId) {
        stable.refetchUserDemandes?.(data.clientId);
        displayNotification(
          stable,
          data.titre ?? 'Proposition acceptée',
          data.message ??
            `${data.voyageurNom || 'Le voyageur'} a accepté votre proposition.`,
          `${ROUTES.MES_DEMANDE_DETAILS(data.demandeId ?? '')}`
        );
      } else if (data.voyageurId === stable.userId) {
        stable.refetchUserVoyages?.(data.voyageurId);
        displayNotification(
          stable,
          data.titre ?? 'Proposition confirmée',
          data.message ?? `Votre voyage a été mis à jour.`,
          `${ROUTES.MES_VOYAGE_DETAILS(data.voyageId ?? '')}`
        );
      }
      break;

    case EventType.PROPOSITION_REJECTED:
      stable.refetchPropositionsVoyage?.(data.voyageId);

      if (data.clientId === stable.userId) {
        stable.refetchUserDemandes?.(data.clientId);
        displayNotification(
          stable,
          data.titre ?? 'Proposition refusée',
          data.message ??
            `${data.voyageurNom || 'Le voyageur'} a refusé votre proposition.`,
          `${ROUTES.MES_DEMANDE_DETAILS(data.demandeId ?? '')}`
        );
      } else if (data.voyageurId === stable.userId) {
        displayNotification(
          stable,
          data.titre ?? 'Proposition refusée',
          data.message ?? `Vous avez refusé une proposition.`,
          `${ROUTES.MES_VOYAGE_DETAILS(data.voyageId ?? '')}`
        );
      }
      break;

    case EventType.PROPOSITION_CANCELLED:
      stable.refetchPropositionsVoyage?.(data.voyageId);

      if (
        data.recipientId === stable.userId ||
        data.voyageurId === stable.userId
      ) {
        if (data.voyageId) stable.refetchUserVoyages?.(stable.userId);
        else if (data.demandeId) stable.refetchUserDemandes?.(stable.userId);

        displayNotification(
          stable,
          data.titre ?? 'Proposition annulée',
          data.message ?? 'Une de vos propositions a été annulée.',
          data.voyageId
            ? `${ROUTES.MES_VOYAGE_DETAILS(data.voyageId)}`
            : data.demandeId
              ? `${ROUTES.MES_DEMANDE_DETAILS(data.demandeId)}`
              : undefined
        );
      }
      break;

    default:
      break;
  }
};
