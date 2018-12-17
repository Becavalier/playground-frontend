var cacheKey = new Date().toISOString();

var cacheWhitelist = [cacheKey];

var cacheFileList = serviceWorkerOption.assets;

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheKey).then(function (cache) {
      return cache.addAll(cacheFileList);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
