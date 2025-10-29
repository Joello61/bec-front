/**
 * Service Worker CoBage – v4.0.0
 * Fonctionnalités :
 * - Mise en cache robuste avec gestion d'erreur individuelle
 * - Stratégies de cache par type de ressource (Request.destination)
 * - Gestion offline avec fallback
 * - Nettoyage automatique des anciens caches
 */

const VERSION = 'v4.0.0';
const STATIC_CACHE = `cobage-static-${VERSION}`;
const DYNAMIC_CACHE = `cobage-dynamic-${VERSION}`;
const OFFLINE_PAGE = '/offline.html';

const STATIC_ASSETS = [
  '/offline.html',
  '/favicon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  // Images de fallback
  '/images/logo/logo-1.png',
  '/images/logo/logo_blanc.png',
];

// Installation : Cache les assets critiques
self.addEventListener('install', (event) => {
  console.log('[SW v4] 🚀 Installation en cours...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW v4] 📦 Ouverture du cache statique');
        
        // Méthode robuste : cache individuellement avec gestion d'erreur
        return Promise.allSettled(
          STATIC_ASSETS.map((url) => {
            return cache.add(url)
              .then(() => {
                console.log(`[SW v4] ✅ Cached: ${url}`);
              })
              .catch((error) => {
                console.warn(`[SW v4] ⚠️ Failed to cache ${url}:`, error.message);
              });
          })
        );
      })
      .then(() => {
        console.log('[SW v4] ✅ Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW v4] ❌ Erreur installation:', error);
      })
  );
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW v4] 🔄 Activation en cours...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              // Supprimer tous les caches sauf les actuels
              return name !== STATIC_CACHE && name !== DYNAMIC_CACHE;
            })
            .map((name) => {
              console.log(`[SW v4] 🗑️ Suppression ancien cache: ${name}`);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW v4] ✅ Activation terminée');
        return self.clients.claim();
      })
  );
});

// Fetch : Stratégies de cache par type de ressource
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Ignorer les requêtes vers d'autres origines (sauf CDN connus)
  if (url.origin !== self.location.origin && !isTrustedOrigin(url.origin)) {
    return;
  }

  // Ignorer les fichiers Next.js internes et les chunks dynamiques
  if (
    url.pathname.startsWith('/_next/static/chunks/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.includes('hot-update') ||
    url.pathname.includes('.map')
  ) {
    return;
  }

  const destination = request.destination;

  // Stratégie selon le type de ressource
  switch (destination) {
    // Documents HTML : Network First (toujours à jour)
    case 'document':
      event.respondWith(networkFirst(request));
      break;

    // Images : Cache First (performance)
    case 'image':
      event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
      break;

    // Styles & Scripts : Stale While Revalidate (équilibre)
    // MAIS : Laisser Next.js gérer ses propres chunks
    case 'style':
    case 'script':
      if (!url.pathname.startsWith('/_next/')) {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
      }
      break;

    // Fonts : Cache First (ne changent jamais)
    case 'font':
      event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
      break;

    // API (JWT requis) : Network Only avec cache de secours
    default:
      if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkOnly(request));
      } else if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
      }
      break;
  }
});

// === STRATÉGIES DE CACHE ===

/**
 * Network First : Réseau prioritaire, cache en secours
 * Idéal pour : Documents HTML, contenu dynamique
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Mettre en cache si succès
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`[SW v4] 📡 Network failed for ${request.url}, trying cache...`);
    
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback vers page offline pour les documents
    if (request.destination === 'document') {
      return caches.match(OFFLINE_PAGE);
    }
    
    throw error;
  }
}

/**
 * Cache First : Cache prioritaire, réseau en secours
 * Idéal pour : Images, fonts, assets statiques
 */
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn(`[SW v4] ⚠️ Failed to fetch ${request.url}:`, error.message);
    throw error;
  }
}

/**
 * Stale While Revalidate : Cache immédiat + mise à jour en background
 * Idéal pour : CSS, JS, assets qui changent occasionnellement
 */
async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((error) => {
      console.warn(`[SW v4] ⚠️ Background fetch failed for ${request.url}`);
      return null;
    });
  
  // Retourner le cache immédiatement, ou attendre le réseau
  return cachedResponse || fetchPromise;
}

/**
 * Network Only : Toujours le réseau (pas de cache)
 * Idéal pour : API avec JWT, contenu sensible
 */
async function networkOnly(request) {
  return fetch(request);
}

/**
 * Vérifie si l'origine est de confiance
 */
function isTrustedOrigin(origin) {
  const trustedOrigins = [
    'https://cdnjs.cloudflare.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];
  return trustedOrigins.includes(origin);
}

// === MESSAGES DU CLIENT ===

self.addEventListener('message', (event) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, data } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      console.log('[SW v4] ⚡ Force update (skipWaiting)');
      self.skipWaiting();
      break;

    case 'CLEAR_CACHE':
      console.log('[SW v4] 🗑️ Nettoyage manuel des caches');
      event.waitUntil(
        caches.keys().then((keys) => 
          Promise.all(keys.map((key) => caches.delete(key)))
        )
      );
      break;

    case 'GET_VERSION':
      event.ports[0].postMessage({ version: VERSION });
      break;

    default:
      console.log('[SW v4] 📨 Message inconnu:', type);
  }
});

// === BACKGROUND SYNC (Futur) ===

self.addEventListener('sync', (event) => {
  console.log('[SW v4] 🔄 Background Sync:', event.tag);

  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

/**
 * Synchronisation des messages hors ligne (À implémenter)
 */
async function syncMessages() {
  try {
    console.log('[SW v4] 💬 (TODO) Sync messages hors ligne...');
    // Implémenter avec IndexedDB
  } catch (error) {
    console.error('[SW v4] ❌ Erreur sync messages:', error);
  }
}

// === NOTIFICATIONS PUSH (Futur) ===

self.addEventListener('push', (event) => {
  console.log('[SW v4] 🔔 Push notification reçue');

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'CoBage';
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-96x96.png',
    data: data,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW v4] 👆 Notification cliquée');
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});