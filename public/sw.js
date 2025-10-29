/**
 * Service Worker CoBage – v2.0.0
 * Fonctionnalités :
 * - Mise en cache des fichiers statiques essentiels
 * - Gestion des requêtes API en mode réseau-prioritaire
 * - Fallback vers offline.html si déconnexion
 * - Prêt pour syncMessages() et notifications futures
 */

const VERSION = 'v2.0.0';
const STATIC_CACHE = `cobage-static-${VERSION}`;
const DYNAMIC_CACHE = `cobage-dynamic-${VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/favicon.svg',
  '/site.webmanifest',
  '/apple-touch-icon.png',
  '/favicon-96x96.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installation CoBage...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      try {
        console.log('[SW] Mise en cache des assets statiques...');
        await cache.addAll(STATIC_ASSETS);
        console.log('[SW] Mise en cache réussie ✅');
      } catch (err) {
        console.warn('[SW] Certains assets n’ont pas pu être mis en cache:', err);
      }
    })()
  );

  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  console.log('[SW] Activation CoBage...');
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((n) => ![STATIC_CACHE, DYNAMIC_CACHE].includes(n))
          .map((oldName) => {
            console.log('[SW] Suppression ancien cache:', oldName);
            return caches.delete(oldName);
          })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP (ex. chrome-extension://)
  if (!url.protocol.startsWith('http')) return;

  // API (JWT requis) → Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Assets statiques (images, scripts, styles) → Stale While Revalidate
  if (['image', 'font', 'style', 'script'].includes(request.destination)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetcregisterServiceWorkerh(request)
          .then((res) => {
            cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Pages → Network First avec fallback offline
  event.respondWith(
    fetch(request)
      .then((res) => {
        const clone = res.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        return res;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/offline.html'))
      )
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'SKIP_WAITING') {
    console.log('[SW] Forçage de mise à jour (skipWaiting)');
    self.skipWaiting();
  }

  if (data.type === 'CLEAR_CACHE') {
    console.log('[SW] Suppression manuelle de tous les caches');
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    );
  }
});

self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync détecté :', event.tag);
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  try {
    console.log('[SW] (TODO) Synchronisation des messages hors ligne...');
    // Exemple futur :
    // - Ouvrir IndexedDB 'cobage-messages'
    // - Lire les messages en attente
    // - Les envoyer à /api/messages avec JWT
    // - Supprimer ceux envoyés
  } catch (err) {
    console.error('[SW] Erreur pendant syncMessages :', err);
  }
}
