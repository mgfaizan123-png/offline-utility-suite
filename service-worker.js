const CACHE_NAME = 'offline-utility-v1';
const RUNTIME_CACHE = 'runtime-v1';

const STATIC_ASSETS = [
  '/offline-utility-suite/',
  '/offline-utility-suite/index.html',
  '/offline-utility-suite/app.js',
  '/offline-utility-suite/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('[SW] Some assets could not be cached (this is ok):', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // For HTML/JS/CSS - network first
  if (request.mode === 'navigate' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const cache = caches.open(RUNTIME_CACHE);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fall back to cache
          return caches.match(request)
            .then(cached => cached || caches.match('/offline-utility-suite/index.html'));
        })
    );
  }
  // For other requests - cache first
  else {
    event.respondWith(
      caches.match(request)
        .then((cached) => {
          if (cached) return cached;
          return fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const cache = caches.open(RUNTIME_CACHE);
                cache.then(c => c.put(request, response.clone()));
              }
              return response;
            })
            .catch(() => {
              console.log('[SW] Offline - no cache for:', request.url);
              return new Response('Offline - resource not available', { status: 503 });
            });
        })
    );
  }
});
