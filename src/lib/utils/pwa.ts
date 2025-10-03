/**
 * Enregistrement et gestion du Service Worker
 */

export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker non supporté');
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker enregistré:', registration.scope);

      // Vérifier les mises à jour toutes les heures
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Écouter les mises à jour du SW
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nouvelle version disponible
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('Erreur enregistrement Service Worker:', error);
    }
  });
}

/**
 * Afficher une notification pour mettre à jour l'app
 */
function showUpdateNotification(): void {
  const shouldUpdate = confirm(
    'Une nouvelle version est disponible. Voulez-vous mettre à jour ?'
  );

  if (shouldUpdate) {
    window.location.reload();
  }
}

/**
 * Désenregistrer le Service Worker
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((reg) => reg.unregister()));
    console.log('Service Worker désenregistré');
  } catch (error) {
    console.error('Erreur désenregistrement:', error);
  }
}

/**
 * Vérifier si l'app est installée
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

/**
 * Hook pour gérer l'installation PWA
 */
export function usePWAInstall() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let deferredPrompt: any = null;

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });
  }

  const installPWA = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('Prompt d\'installation non disponible');
      return false;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Installation: ${outcome}`);
    deferredPrompt = null;
    
    return outcome === 'accepted';
  };

  return {
    canInstall: !!deferredPrompt,
    installPWA,
    isInstalled: isPWAInstalled()
  };
}

/**
 * Vérifier si l'utilisateur est en ligne
 */
export function useOnlineStatus(): boolean {
  if (typeof window === 'undefined') return true;
  
  return navigator.onLine;
}

/**
 * Écouter les changements de connexion
 */
export function watchOnlineStatus(callback: (isOnline: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}