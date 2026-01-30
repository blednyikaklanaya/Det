const CACHE_NAME = 'worker-v01'; // ⬅️ МЕНЯЙ ПРИ КАЖДОМ РЕЛИЗЕ
const STATIC_ASSETS = [
  '/style.css',
  '/mainWorker.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      ),
      self.clients.claim(),
    ])
  );
});

// FETCH
self.addEventListener('fetch', event => {
  // HTML — ВСЕГДА С СЕТИ (чтобы обновлялся SPA)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Остальное — cache first
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
