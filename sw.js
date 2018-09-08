// Cache parts of page for offline-first
let currentCache = 'restaurantReviews-v1'
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(currentCache).then(function(cache) {
      return cache.addAll([
        '/',
        'restaurant.html',
        '/css/styles.css',
        '/css/styles600.css',
        '/css/styles900.css',
        '/css/stylesLarge.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
      ]);
    })
    .catch(function(error) {
      console.log(error);
    })
  );
});

// Delete old cache when new is installed
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurantReviews') &&
                 cacheName != currentCache;
        }).map(function(cacheName) {
          return caches.delete(cachename);
        })
      );
    })
  );
});

// Intercept fetch requests and load from cache if possible
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
