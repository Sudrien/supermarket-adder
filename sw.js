const CACHE_NAME = 'supermarket-adder-cache-v1';
const urlsToCache = [
  '/'
];

// Install event: Cache specified resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the response is valid, update the cache and return the response
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        // If the network request fails, try to return the cached version
        return caches.match(event.request);
      })
  );
});
