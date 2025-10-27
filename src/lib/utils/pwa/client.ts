export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log('[SW] enregistré :', registration.scope);

      // Vérifier les mises à jour toutes les heures
      setInterval(() => registration.update(), 60 * 60 * 1000);

      // Écouter les nouvelles versions du SW
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdatePrompt();
          }
        });
      });
    } catch (err) {
      console.error('[SW] Erreur enregistrement :', err);
    }
  });
}

/**
 * Alerte utilisateur lorsqu’une nouvelle version du SW est prête
 */
function showUpdatePrompt(): void {
  const shouldUpdate = confirm(
    'Une nouvelle version de CoBage est disponible. Voulez-vous recharger l’application ?'
  );
  if (shouldUpdate) window.location.reload();
}

/**
 * Vérifie si l’app est installée (PWA)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // Safari iOS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

/**
 * Désenregistre le SW (utile seulement en dev/debug)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map((r) => r.unregister()));
  console.log('[SW] Désenregistré');
}
