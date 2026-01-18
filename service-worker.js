// service-worker.js
const CACHE_NAME = 'cleantik-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/script.js',
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/clean-tik-og.png',
  '/site.webmanifest'
];

// Instalar Service Worker y cachear recursos
self.addEventListener('install', event => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cacheando recursos principales');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Recursos cacheados correctamente');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Error al cachear recursos:', error);
      })
  );
});

// Activar Service Worker y limpiar caches viejos
self.addEventListener('activate', event => {
  console.log('Service Worker activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activado y listo');
      return self.clients.claim();
    })
  );
});

// Estrategia: Cache First, luego Network
self.addEventListener('fetch', event => {
  // Evitar peticiones a APIs externas y BuyMeACoffee
  if (event.request.url.includes('render.com') || 
      event.request.url.includes('buymeacoffee.com')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si está en cache, devolverlo
        if (response) {
          return response;
        }
        
        // Si no está en cache, hacer petición a network
        return fetch(event.request)
          .then(networkResponse => {
            // Solo cachear si es una respuesta válida
            if (!networkResponse || networkResponse.status !== 200 || 
                networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clonar la respuesta para cachearla
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(() => {
            // Si falla la red, podrías mostrar una página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Manejar mensajes desde la app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});