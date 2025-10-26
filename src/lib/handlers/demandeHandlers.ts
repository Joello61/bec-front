import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements liés aux demandes d’envoi
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDemandeEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    case EventType.DEMANDE_CREATED:
      
      if (data.createdBy === stable.userId) return;

      stable.refetchDemandes?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Nouvelle demande publiée',
        data.message ??
          `Une nouvelle demande d’envoi de ${data.villeDepart ?? 'inconnue'} à ${data.villeArrivee ?? 'inconnue'} vient d’être créée.`,
        ROUTES.EXPLORE
      );
      break;

    case EventType.DEMANDE_UPDATED:
      if (data.createdBy === stable.userId) stable.refetchUserDemandes?.(stable.userId);
      stable.refetchDemandes?.();
      displayNotification(
        stable,
        data.titre ?? 'Demande mise à jour',
        data.message ?? 'Une demande d’envoi a été modifiée.',
        `${ROUTES.DEMANDE_DETAILS(data.demandeId ?? '')}`
      );
      break;

    case EventType.DEMANDE_CANCELLED:
      if (data.createdBy === stable.userId) stable.refetchUserDemandes?.(stable.userId);
      stable.refetchDemandes?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Demande annulée',
        data.message ?? 'Une demande d’envoi a été annulée.'
      );
      break;

    case EventType.DEMANDE_EXPIRED:
      if (data.createdBy === stable.userId) stable.refetchUserDemandes?.(stable.userId);
      stable.refetchDemandes?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Demande expirée',
        data.message ?? 'Une demande d’envoi est arrivée à expiration.'
      );
      break;

    case EventType.DEMANDE_STATUT_UPDATED:
      if (data.createdBy === stable.userId) stable.refetchUserDemandes?.(stable.userId);
      stable.refetchDemandes?.();
      displayNotification(
        stable,
        data.titre ?? 'Statut mis à jour',
        data.message ?? `Le statut de votre demande est désormais : ${data.statut ?? 'mis à jour'}.`
      );
      break;

    case EventType.DEMANDE_MATCHED:
      stable.refetchUserDemandes?.(stable.userId);
      displayNotification(
        stable,
        data.titre ?? 'Correspondance trouvée !',
        data.message ??
          `Un voyage correspondant à votre demande a été trouvé (${data.matchCount ?? 1} voyage${data.matchCount > 1 ? 's' : ''}).`,
        `${ROUTES.MES_DEMANDE_DETAILS(data.demandeId ?? '')}`
      );
      break;

    case EventType.DEMANDE_FAVORITED:
      stable.refetchFavorisDemandes?.();
      displayNotification(
        stable,
        data.titre ?? 'Demande ajoutée aux favoris',
        data.message ?? 'Vous avez ajouté cette demande à vos favoris.'
      );
      break;

    case EventType.DEMANDE_UNFAVORITED:
      stable.refetchFavorisDemandes?.();
      displayNotification(
        stable,
        data.titre ?? 'Demande retirée des favoris',
        data.message ?? 'Cette demande a été retirée de vos favoris.'
      );
      break;

    default:
      break;
  }
};
