import { StableContext } from '@/types/realtime';

// === Import de tous les handlers ===
import { handleUserEvents } from './userHandlers';
import { handleVoyageEvents } from './voyageHandlers';
import { handleDemandeEvents } from './demandeHandlers';
import { handlePropositionEvents } from './propositionHandlers';
import { handleMessageEvents } from './messageHandlers';
import { handleNotificationEvents } from './notificationHandlers';
import { handleAdminEvents } from './adminHandlers';
import { handleSignalementEvents } from './signalementHandlers';
import { handleAvisEvents } from './avisHandlers';
import { handleContactEvents } from './contactHandlers';
import { handleFavoriEvents } from './favoriHandlers';
import { handleSettingsEvents } from './settingsHandlers';

/**
 * Routeur global des événements Mercure → Handler approprié
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
        console.warn(`[Mercure] Aucun handler trouvé pour "${eventType}"`, data);
        break;
    }
  } catch (err) {
    console.error(`[Mercure] Erreur dans le handler pour "${eventType}":`, err);
  }
}
