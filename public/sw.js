// NammaNudi Offline-First Service Worker
// Kannada Digital Innovation Hackathon 2026
const CACHE_NAME = 'nammanudi-v1';

const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg'
];

// Pre-cache core shell during install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only intercept GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Navigation requests (SPA routes: /phrasebook, /quiz, /saved, etc.)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          // Try matched route first
          const matched = await cache.match(request);
          if (matched) return matched;
          // Fallback to cached index.html for SPA client-side routing
          const cachedIndex = await cache.match('/index.html');
          if (cachedIndex) return cachedIndex;
          const cachedRoot = await cache.match('/');
          return cachedRoot || Response.error();
        })
    );
    return;
  }

  // 2. Audio files (/audio/kn/*.mp3) — Cache-first with Range request support for offline playback
  if (url.origin === location.origin && (url.pathname.includes('/audio/') || url.pathname.endsWith('.mp3'))) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cleanRequest = new Request(url.pathname, { method: 'GET' });
        const cached = await cache.match(cleanRequest);

        if (cached) {
          if (request.headers.has('range')) {
            const rangeHeader = request.headers.get('range');
            const arrayBuffer = await cached.arrayBuffer();
            const bytes = /^bytes=(\d+)-(\d+)?$/g.exec(rangeHeader || '');
            if (bytes) {
              const start = parseInt(bytes[1], 10);
              const end = bytes[2] ? parseInt(bytes[2], 10) : arrayBuffer.byteLength - 1;
              const sliced = arrayBuffer.slice(start, end + 1);
              return new Response(sliced, {
                status: 206,
                statusText: 'Partial Content',
                headers: {
                  ...Object.fromEntries(cached.headers.entries()),
                  'Content-Range': `bytes ${start}-${end}/${arrayBuffer.byteLength}`,
                  'Content-Length': String(sliced.byteLength),
                  'Accept-Ranges': 'bytes'
                }
              });
            }
          }
          return cached;
        }

        try {
          const networkResponse = await fetch(cleanRequest);
          if (networkResponse && networkResponse.status === 200) {
            await cache.put(cleanRequest, networkResponse.clone());
          }
          if (request.headers.has('range')) {
            const arrayBuffer = await networkResponse.clone().arrayBuffer();
            const rangeHeader = request.headers.get('range');
            const bytes = /^bytes=(\d+)-(\d+)?$/g.exec(rangeHeader || '');
            if (bytes) {
              const start = parseInt(bytes[1], 10);
              const end = bytes[2] ? parseInt(bytes[2], 10) : arrayBuffer.byteLength - 1;
              const sliced = arrayBuffer.slice(start, end + 1);
              return new Response(sliced, {
                status: 206,
                statusText: 'Partial Content',
                headers: {
                  ...Object.fromEntries(networkResponse.headers.entries()),
                  'Content-Range': `bytes ${start}-${end}/${arrayBuffer.byteLength}`,
                  'Content-Length': String(sliced.byteLength),
                  'Accept-Ranges': 'bytes'
                }
              });
            }
          }
          return networkResponse;
        } catch {
          return (await cache.match(cleanRequest)) || Response.error();
        }
      })()
    );
    return;
  }

  // 3. Same-origin static assets (JS, CSS, SVGs, fonts)
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Cache-first with background network revalidation
        if (cachedResponse) {
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {
              // Ignore network failure when revalidating in background
            });
          return cachedResponse;
        }

        // If not in cache, fetch from network and cache
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          return networkResponse;
        });
      })
    );
    return;
  }

  // 4. External assets (e.g. Google Fonts)
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          return cached || Response.error();
        });
      })
    );
  }
});
