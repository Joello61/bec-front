import { EventType } from '@/lib/utils/eventType';
import { displayNotification } from '@/lib/utils/displayNotification';
import type { StableContext } from '@/types/realtime';
import { ROUTES } from '../utils/constants';

/**
 * Gère les événements temps réel liés aux utilisateurs (création, mise à jour, vérification, etc.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleUserEvents = (eventType: string, data: any, stable: StableContext) => {
  switch (eventType) {
    case EventType.USER_REGISTERED:
      // Seuls les admins doivent être notifiés
      if (stable.userId && data?.title) {
        displayNotification(
          stable,
          data.title ?? 'Nouvel utilisateur',
          data.message ?? 'Un nouvel utilisateur vient de s’inscrire.',
          ROUTES.ADMIN_USERS
        );
        if (stable.isAdmin) stable.refetchAdminStats?.();
      }
      break;

    case EventType.USER_PASSWORD_RESET:
      displayNotification(
        stable,
        data.title ?? 'Mot de passe réinitialisé',
        data.message ?? 'Votre mot de passe a été changé avec succès.'
      );
      break;

    case EventType.USER_PASSWORD_FORGOT:
      displayNotification(
        stable,
        data.title ?? 'Demande de réinitialisation',
        data.message ?? 'Une demande de réinitialisation de mot de passe a été effectuée.'
      );
      break;

    case EventType.USER_PROFILE_UPDATED:
      if (data?.isEmailVerified) {
        displayNotification(
          stable,
          data.title ?? 'Email vérifié',
          data.message ?? 'Votre adresse email a bien été vérifiée.'
        );
      } else if (data?.addressDeleted) {
        displayNotification(
          stable,
          data.title ?? 'Adresse supprimée',
          data.message ?? 'Votre adresse enregistrée a été supprimée.'
        );
      } else {
        displayNotification(
          stable,
          data.title ?? 'Profil mis à jour',
          data.message ?? 'Vos informations ont été modifiées.'
        );
      }
      stable.refetchNotif?.();
      break;

    case EventType.USER_VERIFIED_PHONE:
      displayNotification(
        stable,
        data.title ?? 'Téléphone vérifié',
        data.message ?? 'Votre numéro de téléphone a été vérifié avec succès.'
      );
      break;

    case EventType.USER_SETTINGS_UPDATED:
      displayNotification(
        stable,
        data.title ?? 'Paramètres mis à jour',
        data.message ?? 'Vos préférences de compte ont été enregistrées.'
      );
      stable.refetchNotif?.();
      break;

    case EventType.USER_BANNED:
      displayNotification(
        stable,
        data.title ?? 'Compte suspendu',
        data.message ?? 'Votre compte a été temporairement suspendu.'
      );
      break;

    case EventType.USER_UNBANNED:
      displayNotification(
        stable,
        data.title ?? 'Compte réactivé',
        data.message ?? 'Votre compte a été rétabli.'
      );
      break;

    case EventType.USER_DELETED:
      displayNotification(
        stable,
        data.title ?? 'Compte supprimé',
        data.message ?? 'Votre compte a été définitivement supprimé.'
      );
      break;

    default:
      break;
  }
};
