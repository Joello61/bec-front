import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements liés aux voyages (création, mise à jour, annulation, etc.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleVoyageEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {

    case EventType.VOYAGE_CREATED:
      if (data.createdBy === stable.userId) return;
      console.log('Nouveau voyage créé:', data.voyageId);
      stable.refetchVoyages?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Nouveau voyage ajouté',
        data.message ??
          `Un nouveau voyage de ${data.villeDepart ?? 'inconnue'} à ${data.villeArrivee ?? 'inconnue'} vient d’être publié.`,
        ROUTES.EXPLORE
      );
      break;

    case EventType.VOYAGE_UPDATED:
      if (data.createdBy === stable.userId) stable.refetchUserVoyages?.(stable.userId);
      stable.refetchVoyages?.();
      displayNotification(
        stable,
        data.titre ?? 'Voyage mis à jour',
        data.message ?? 'Un voyage a été modifié. Pensez à vérifier les nouvelles informations.',
        `${ROUTES.VOYAGE_DETAILS(data.voyageId ?? '')}`
      );
      break;

    case EventType.VOYAGE_CANCELLED:
      if (data.createdBy === stable.userId) stable.refetchUserVoyages?.(stable.userId);
      stable.refetchVoyages?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Voyage annulé',
        data.message ?? 'Un voyage a été annulé par le voyageur ou par le système.'
      );
      break;

    case EventType.VOYAGE_COMPLETED:
      if (data.createdBy === stable.userId) stable.refetchUserVoyages?.(stable.userId);
      stable.refetchVoyages?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Voyage terminé',
        data.message ?? 'Le voyage a été marqué comme complété avec succès.'
      );
      break;

    case EventType.VOYAGE_EXPIRED:
      if (data.createdBy === stable.userId) stable.refetchUserVoyages?.(stable.userId);
      stable.refetchVoyages?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Voyage expiré',
        data.message ?? 'Un voyage est arrivé à expiration et a été désactivé automatiquement.'
      );
      break;

    case EventType.VOYAGE_FAVORITED:
      stable.refetchFavorisVoyages?.();
      displayNotification(
        stable,
        data.titre ?? 'Voyage ajouté aux favoris',
        data.message ?? 'Vous avez ajouté ce voyage à vos favoris.'
      );
      break;

    case EventType.VOYAGE_UNFAVORITED:
      stable.refetchFavorisVoyages?.();
      displayNotification(
        stable,
        data.titre ?? 'Voyage retiré des favoris',
        data.message ?? 'Ce voyage a été retiré de vos favoris.'
      );
      break;

    default:
      break;
  }
};
