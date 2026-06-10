const CACHE_NAME = 'clavis-store-v2';
const ASSETS = [
  './index.html',
  './manifest.json'
];

// Installieren: Assets cachen, aber Fehler ignorieren, damit die App nicht blockiert
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.log("Cache-Aufbau übersprungen/mobil toleriert:", err));
    })
  );
  self.skipWaiting();
});

// Aktivieren und alten Cache löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Netzwerk-First-Strategie: Wenn das Netzwerk da ist, lade immer live!
self.addEventListener('fetch', (event) => {
  // Verhindert Abstürze bei externen CDN-Aufrufen wie Tailwind
  if (!event.request.url.startsWith(self.location.origin)) {
    return; 
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

