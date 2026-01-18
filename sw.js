// sw.js - Versión mínima del Service Worker como backup
self.addEventListener('install', event => {
  console.log('SW instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('SW activado');
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
