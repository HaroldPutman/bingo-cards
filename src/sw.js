const CACHE_NAME = 'bingo-card-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/film-tropes.json',
  '/css/app.css',
  '/css/themes/default.css',
  '/images/daub.jpg',
  '/images/daub2.jpg'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
