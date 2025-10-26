import { StableContext } from '@/types/realtime';

export function displayNotification(
  stable: StableContext,
  title: string,
  message: string,
  onClickRoute?: string
) {
  try {
    console.log('[InAppNotif] typeof stable.showNotification =', typeof stable.showNotification);

    // In-App si onglet visible
    if (!document.hidden) {
      stable.showNotification(title, message);
      return;
    }

    // Native sinon
    if ('Notification' in window && Notification.permission === 'granted') {
      const notif = new Notification(title, {
        body: message,
        icon: '/images/logo/logo_icon_only.png',
        badge: '/images/logo/logo_icon_only.png',
      });

      notif.onclick = () => {
        window.focus();
        if (onClickRoute) stable.router.push(onClickRoute);
      };
    } else {
      console.log(`[Notification fallback] ${title}: ${message}`);
    }
  } catch (err) {
    console.error('[displayNotification] Erreur lors de l’affichage :', err);
  }
}
