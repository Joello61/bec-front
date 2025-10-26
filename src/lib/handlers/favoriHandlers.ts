import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements liés aux favoris (voyages et demandes)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleFavoriEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    
    case EventType.VOYAGE_FAVORITED:
      stable.refetchFavorisVoyages?.();
      displayNotification(
        stable,
        data.titre ?? 'Voyage ajouté aux favoris',
        data.message ?? 'Vous avez ajouté un voyage à vos favoris.',
        ROUTES.FAVORIS
      );
      break;

    case EventType.VOYAGE_UNFAVORITED:
      stable.refetchFavorisVoyages?.();
      displayNotification(
        stable,
        data.titre ?? 'Voyage retiré des favoris',
        data.message ?? 'Ce voyage a été retiré de vos favoris.',
        ROUTES.FAVORIS
      );
      break;

    case EventType.DEMANDE_FAVORITED:
      stable.refetchFavorisDemandes?.();
      displayNotification(
        stable,
        data.titre ?? 'Demande ajoutée aux favoris',
        data.message ?? 'Vous avez ajouté une demande à vos favoris.',
        ROUTES.FAVORIS
      );
      break;

    case EventType.DEMANDE_UNFAVORITED:
      stable.refetchFavorisDemandes?.();
      displayNotification(
        stable,
        data.titre ?? 'Demande retirée des favoris',
        data.message ?? 'Cette demande a été retirée de vos favoris.',
        ROUTES.FAVORIS
      );
      break;

    default:
      break;
  }
};
