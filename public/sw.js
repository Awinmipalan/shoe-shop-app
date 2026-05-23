const CACHE_NAME = 'tonyi-footwear-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/models/shoe_1.glb',
  '/models/shoe_2.glb',
  '/models/shoe_3.glb',
  '/models/shoe_4.glb',
  '/intro.mp4'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching pre-selected assets...');
      // Individually add cache files to prevent one failure from breaking general asset caching
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => console.log(`[Service Worker] Failed to cache ${url}:`, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache storage:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Focus only on local assets (same origin)
  if (requestUrl.origin === self.location.origin) {
    // Completely bypass interception for Vite dev server scripts, hot-module reloads, TS source modules, or development/preview hostnames
    if (
      requestUrl.hostname === 'localhost' ||
      requestUrl.hostname === '127.0.0.1' ||
      requestUrl.hostname.includes('ais-dev-') ||
      requestUrl.hostname.includes('ais-pre-') ||
      requestUrl.hostname.includes('.run.app') ||
      requestUrl.pathname.includes('/@vite') ||
      requestUrl.pathname.includes('/@id') ||
      requestUrl.pathname.includes('/@react-refresh') ||
      requestUrl.pathname.endsWith('.ts') ||
      requestUrl.pathname.endsWith('.tsx') ||
      requestUrl.pathname.includes('/src/') ||
      requestUrl.pathname.includes('/node_modules/')
    ) {
      return; // Hand over to native browser fetch directly without caching or interception
    }

    const isHeavyAsset = 
      requestUrl.pathname.endsWith('.glb') || 
      requestUrl.pathname.endsWith('.mp4');

    if (isHeavyAsset) {
      // Cache-first for large assets (GLB models & Video) to optimize memory and speed
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cacheCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, cacheCopy);
              });
            }
            return networkResponse;
          }).catch(() => {
            return new Response('Asset not available offline.', { status: 503 });
          });
        })
      );
    } else {
      // Stale-while-revalidate strategy for CSS, JS, HTML and other sub-pages
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cacheCopy = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, cacheCopy);
              });
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        })
      );
    }
  }
});
