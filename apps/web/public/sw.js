const CACHE_NAME = 'mysafevault-pwa-v1';

// We just need a minimal fetch event listener to satisfy the PWA installability requirement.
// Offline caching logic can be expanded here later if desired.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Minimal passthrough
  event.respondWith(fetch(event.request).catch(() => {
    return new Response('Offline content goes here later.', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }));
});
