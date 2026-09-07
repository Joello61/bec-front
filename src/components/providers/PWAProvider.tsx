'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  registerServiceWorker,
  getServiceWorkerVersion,
  isPWAInstalled,
  isOnline,
  onConnectionChange,
} from '@/lib/utils/pwa/registerSW';

// Etat externe (navigator.onLine, display-mode) : useSyncExternalStore evite
// tout setState synchrone dans un effet et reste coherent avec l'hydratation SSR.
function subscribeToOnlineStatus(onChange: () => void): () => void {
  return onConnectionChange(() => onChange());
}

function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribeToOnlineStatus, isOnline, () => true);
}

function subscribeToDisplayModeChange(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(display-mode: standalone)');
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function useIsPWAInstalled(): boolean {
  return useSyncExternalStore(subscribeToDisplayModeChange, isPWAInstalled, () => false);
}

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- ecrit pour le log de debug ci-dessous, pas encore expose aux enfants
  const [swVersion, setSwVersion] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- idem, scaffolding pour un futur contexte PWA
  const isAppOnline = useOnlineStatus();
  const isPWA = useIsPWAInstalled();

  useEffect(() => {
    // Enregistrer le Service Worker
    registerServiceWorker();

    // Récupérer la version du SW
    getServiceWorkerVersion().then((version) => {
      if (version) {
        setSwVersion(version);
        console.log('[PWA] Version actuelle:', version);
      }
    });
  }, []);

  // Logs pour le développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[PWA] Mode développement - SW désactivé');
      console.log('[PWA] Pour tester le SW : npm run build && npm start');
    }

    if (isPWA) {
      console.log('[PWA] 📱 Application installée en mode standalone');
    }
  }, [isPWA]);

  return <>{children}</>;
}

/**
 * Hook personnalisé pour accéder aux infos PWA
 */
export function usePWA() {
  const [version, setVersion] = useState<string | null>(null);
  const installed = useIsPWAInstalled();
  const online = useOnlineStatus();

  useEffect(() => {
    getServiceWorkerVersion().then(setVersion);
  }, []);

  return {
    version,
    isInstalled: installed,
    isOnline: online,
  };
}

/**
 * Composant optionnel : Badge de version (pour le debug)
 */
export function PWAVersionBadge() {
  const { version, isInstalled, isOnline } = usePWA();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {version && (
        <div className="px-3 py-1.5 bg-gray-900 text-white text-xs rounded-full font-mono shadow-lg">
          SW: {version}
        </div>
      )}
      {isInstalled && (
        <div className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-full font-mono shadow-lg">
          📱 PWA
        </div>
      )}
      {!isOnline && (
        <div className="px-3 py-1.5 bg-orange-600 text-white text-xs rounded-full font-mono shadow-lg">
          ⚠️ Offline
        </div>
      )}
    </div>
  );
}

/**
 * Composant : Indicateur de connexion pour l'utilisateur
 */
export function ConnectionIndicator() {
  const { isOnline } = usePWA();
  const [showIndicator, setShowIndicator] = useState(false);

  // Afficher immediatement au passage hors-ligne : ajuste le state pendant le
  // rendu (pattern React officiel) plutot que dans un effet.
  const [prevIsOnline, setPrevIsOnline] = useState(isOnline);
  if (isOnline !== prevIsOnline) {
    setPrevIsOnline(isOnline);
    if (!isOnline) {
      setShowIndicator(true);
    }
  }

  useEffect(() => {
    if (isOnline) {
      // Masquer après 2 secondes quand revient en ligne
      const timer = setTimeout(() => setShowIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showIndicator) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg text-sm font-medium transition-all ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-orange-600 text-white'
      }`}
    >
      {isOnline ? (
        <>
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
          Connexion rétablie
        </>
      ) : (
        <>
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-2" />
          Mode hors ligne
        </>
      )}
    </div>
  );
}