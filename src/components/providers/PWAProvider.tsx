'use client';

import { useEffect, useState } from 'react';
import {
  registerServiceWorker,
  getServiceWorkerVersion,
  isPWAInstalled,
  isOnline,
  onConnectionChange,
} from '@/lib/utils/pwa/registerSW';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [swVersion, setSwVersion] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAppOnline, setIsAppOnline] = useState(true);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Enregistrer le Service Worker
    registerServiceWorker();

    // Vérifier si installé en PWA
    setIsPWA(isPWAInstalled());

    // Vérifier le statut de connexion initial
    setIsAppOnline(isOnline());

    // Récupérer la version du SW
    getServiceWorkerVersion().then((version) => {
      if (version) {
        setSwVersion(version);
        console.log('[PWA] Version actuelle:', version);
      }
    });

    // Écouter les changements de connexion
    const cleanup = onConnectionChange((online) => {
      setIsAppOnline(online);
      console.log('[PWA] État connexion:', online ? '✅ En ligne' : '⚠️ Hors ligne');
    });

    return cleanup;
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
  const [installed, setInstalled] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setInstalled(isPWAInstalled());
    setOnline(isOnline());

    getServiceWorkerVersion().then(setVersion);

    const cleanup = onConnectionChange(setOnline);
    return cleanup;
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

  useEffect(() => {
    if (!isOnline) {
      setShowIndicator(true);
    } else {
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