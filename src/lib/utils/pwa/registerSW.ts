import { logger } from '@/lib/utils/logger';

/**
 * Enregistre le Service Worker et gère les mises à jour
 * Compatible Next.js 15 (App Router)
 */
export function registerServiceWorker(): void {
  // Vérifier le support
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    logger.log('[PWA] Service Worker non supporté');
    return;
  }

  // Désactiver en développement
  if (process.env.NODE_ENV !== 'production') {
    logger.log('[PWA] Mode dev : Service Worker désactivé');
    logger.log('[PWA] Pour tester : npm run build && npm start');
    return;
  }

  // Attendre que la page soit chargée
  window.addEventListener('load', async () => {
    try {
      // Enregistrer le SW
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Toujours vérifier les mises à jour
      });

      logger.log('[PWA] Service Worker enregistré:', registration.scope);

      // Gérer les mises à jour
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        logger.log('[PWA] Nouvelle version détectée...');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              logger.log('[PWA] Mise à jour disponible');
              handleUpdate(newWorker);
            } else {
              // Première installation
              logger.log('[PWA] Application installée et prête');
            }
          }
        });
      });

      // Vérifier les mises à jour périodiquement (toutes les heures)
      setInterval(() => {
        logger.log('[PWA] Vérification des mises à jour...');
        registration.update();
      }, 60 * 60 * 1000);

      // Vérifier lors du retour de l'utilisateur
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          registration.update();
        }
      });
    } catch (error) {
      logger.error('[PWA] Erreur enregistrement:', error);
    }
  });
}

/**
 * Gère la mise à jour du Service Worker
 */
function handleUpdate(worker: ServiceWorker): void {
  // Afficher une notification à l'utilisateur
  showUpdatePrompt(worker);
}

/**
 * Alerte utilisateur lorsqu'une nouvelle version du SW est prête
 * Tu peux remplacer confirm() par ton système de Toast/Modal
 */
function showUpdatePrompt(worker?: ServiceWorker): void {
  const shouldUpdate = confirm(
    'Une nouvelle version de CoBage est disponible !\n\nVoulez-vous mettre à jour maintenant ?'
  );

  if (shouldUpdate) {
    if (worker) {
      // Forcer l'activation du nouveau SW
      worker.postMessage({ type: 'SKIP_WAITING' });

      // Recharger après activation
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        logger.log('[PWA] Rechargement de l\'application...');
        window.location.reload();
      });
    } else {
      // Fallback : recharger directement
      window.location.reload();
    }
  }
}

/**
 * Vérifie si l'app est installée (PWA)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  // Vérifier le mode display
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  // Vérifier Safari iOS
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isIOSStandalone = (window.navigator as any).standalone === true;

  return isStandalone || isIOSStandalone;
}

/**
 * Obtient la version du Service Worker actuel
 */
export async function getServiceWorkerVersion(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      resolve(event.data?.version || null);
    };

    if (!navigator.serviceWorker.controller) {
      resolve(null);
      return;
    }

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_VERSION' },
      [messageChannel.port2]
    );

    // Timeout après 2 secondes
    setTimeout(() => resolve(null), 2000);
  });
}

/**
 * Désinstalle le Service Worker (utile pour le debug)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      const success = await registration.unregister();
      logger.log('[PWA] Service Worker désinstallé:', success);
    }

    // Nettoyer les caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    logger.log('[PWA] Caches supprimés');
  } catch (error) {
    logger.error('[PWA] Erreur désinstallation:', error);
  }
}

/**
 * Vérifie si l'utilisateur est en ligne
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Écoute les changements de connexion
 */
export function onConnectionChange(
  callback: (isOnline: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Retourner la fonction de nettoyage
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Demande la permission pour les notifications push (futur)
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (typeof window === 'undefined') return null;
  if (!('Notification' in window)) {
    logger.log('[PWA] Notifications non supportées');
    return null;
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    logger.log('[PWA] Notifications refusées par l\'utilisateur');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    logger.log('[PWA] Permission notifications:', permission);
    return permission;
  } catch (error) {
    logger.error('[PWA] Erreur permission notifications:', error);
    return null;
  }
}