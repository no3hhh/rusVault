var CACHE_NAME = 'rusvault-v2';
var ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // NEVER intercept external requests — let them go straight to network
  if (url.origin !== self.location.origin) {
    return;
  }

  // For same-origin: cache-first, fallback to network
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(resp) {
        if (resp && resp.ok && e.request.method === 'GET') {
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return resp;
      });
    }).then(function(resp) {
      if (resp) return resp;
      return new Response('Not found', { status: 404 });
    }).catch(function() {
      if (e.request.destination === 'document') {
        return caches.match('./index.html');
      }
      return new Response('Offline', { status: 503 });
    })
  );
});
