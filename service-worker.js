const CACHE_NAME = "cachebola";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/pages/klasemen.html",
  "/pages/pertandingan.html",
  "/pages/favorit.html",
  "/tim.html",
  "/detail_match.html",
  "/css/materialize.min.css",
  "/css/custom.css",
  "/js/materialize.min.js",
  "/js/jquery-3.2.1.min.js",
  "/js/moment-with-locales.js",
  "/js/football_api.js",
  "/js/idb.js",
  "/js/db.js",
  "/js/nav.js",
  "/manifest.json",
  "/icon.png",
];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org/";

  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});