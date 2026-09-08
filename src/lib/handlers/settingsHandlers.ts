import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements liés aux paramètres utilisateur (profil, préférences, adresses, notifications)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleSettingsEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    case EventType.USER_PROFILE_UPDATED:
      stable.refetchUser?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();
      displayNotification(
        stable,
        data.titre ?? 'Profil mis à jour',
        data.message ?? 'Vos informations personnelles ont été modifiées avec succès.',
        ROUTES.PROFILE
      );
      break;

    case EventType.USER_SETTINGS_UPDATED:
      stable.refetchUser?.();
      if (stable.isAdmin) stable.refetchAdminStats?.();

      if (stable.isAdmin) {
        displayNotification(
          stable,
          data.titre ?? 'Mise à jour du profil utilisateur',
          data.message ??
            `L’utilisateur N°${data.userId ?? '-'} a modifié ses paramètres.`,
          ROUTES.ADMIN_USERS
        );
      } else {
        displayNotification(
          stable,
          data.titre ?? 'Paramètres enregistrés',
          data.message ?? 'Vos préférences ont été enregistrées avec succès.',
          ROUTES.SETTINGS
        );
      }
      break;

    case EventType.SETTINGS_UPDATED:
      stable.refetchUser?.();
      displayNotification(
        stable,
        data.titre ?? 'Paramètres mis à jour',
        data.message ?? 'Vos paramètres de compte ont été actualisés.',
        ROUTES.SETTINGS
      );
      break;

    // ============================================================
    // Changement des préférences de notifications
    // ============================================================
    case EventType.SETTINGS_NOTIFICATIONS_CHANGED:
      stable.refetchUser?.();
      displayNotification(
        stable,
        data.titre ?? 'Préférences de notifications',
        data.message ?? 'Vos préférences de notifications ont été mises à jour.',
        ROUTES.SETTINGS
      );
      break;

    default:
      break;
  }
};
