import { logger } from '@/lib/utils/logger';
import { StableContext } from '@/types/realtime';

import { handleAdminEvents } from './adminHandlers';
import { handleAvisEvents } from './avisHandlers';
import { handleContactEvents } from './contactHandlers';
import { handleDemandeEvents } from './demandeHandlers';
import { handleFavoriEvents } from './favoriHandlers';
import { handleMessageEvents } from './messageHandlers';
import { handleNotificationEvents } from './notificationHandlers';
import { handlePropositionEvents } from './propositionHandlers';
import { handleSettingsEvents } from './settingsHandlers';
import { handleSignalementEvents } from './signalementHandlers';
// === Import de tous les handlers ===
import { handleUserEvents } from './userHandlers';
import { handleVoyageEvents } from './voyageHandlers';

/**
 * Routeur global des événements Mercure -> Handler approprié
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dispatchMercureEvent(eventType: string, data: any, stable: StableContext) {
  try {
    switch (true) {
        
      case eventType.startsWith('user.'):
        return handleUserEvents(eventType, data, stable);

      case eventType.startsWith('voyage.'):
        return handleVoyageEvents(eventType, data, stable);

      case eventType.startsWith('demande.'):
        return handleDemandeEvents(eventType, data, stable);

      case eventType.startsWith('proposition.'):
        return handlePropositionEvents(eventType, data, stable);

      case eventType.startsWith('message.') || eventType.startsWith('conversation.'):
        return handleMessageEvents(eventType, data, stable);

      case eventType.startsWith('notification.'):
        return handleNotificationEvents(eventType, data, stable);

      case eventType.startsWith('admin.'):
        return handleAdminEvents(eventType, data, stable);

      case eventType.startsWith('signalement.'):
        return handleSignalementEvents(eventType, data, stable);

      case eventType.startsWith('avis.'):
        return handleAvisEvents(eventType, data, stable);

      case eventType.startsWith('contact.'):
        return handleContactEvents(eventType, data, stable);

      case eventType.includes('favorited') || eventType.includes('unfavorited'):
        return handleFavoriEvents(eventType, data, stable);

      case eventType.startsWith('settings.') || eventType.includes('updated'):
        return handleSettingsEvents(eventType, data, stable);

      default:
        logger.warn(`[Mercure] Aucun handler trouvé pour "${eventType}"`, data);
        break;
    }
  } catch (err) {
    logger.error(`[Mercure] Erreur dans le handler pour "${eventType}":`, err);
  }
}
