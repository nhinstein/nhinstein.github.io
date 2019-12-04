const CACHE_NAME = "cachebola";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/pages/klasemen.html",
  "/tim.html",
  "/detail_match.html",
  "/pages/pertandingan.html",
  "/pages/favorit.html",
  "/css/materialize.min.css",
  "/css/custom.css",
  "/js/materialize.min.js",
  "/js/jquery-3.2.1.min.js",
  "/js/moment-with-locales.js",
  "/js/idb.js",
  "/js/db.js",
  "/js/api/klasemen.js",
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
    event.respondWith(
      caches
        .match(event.request, { cacheName: CACHE_NAME })
        .then(function(response) {
          if (response) {
            console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
            return response;
          }
   
          console.log(
            "ServiceWorker: Memuat aset dari server: ",
            event.request.url
          );
          return fetch(event.request);
        })
    );
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