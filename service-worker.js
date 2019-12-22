importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox){
  console.log(`Workbox berhasil dimuat`);

  workbox.precaching.precacheAndRoute([
    { url: '/index.html', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/custom.css', revision: '1' },
    { url: '/detail_match_fav.html', revision: '1' },
    { url: '/detail_match.html', revision: '1' },
    { url: '/tim.html', revision: '1' },
    { url: '/tim_fav.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
],{
  ignoreUrlParametersMatching: [/.*/]}
);

workbox.routing.registerRoute(
  new RegExp('/images/icons/'),
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'icons'
  })
);

workbox.routing.registerRoute(
  new RegExp('/js/'),
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'js'
  })
);


workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
);


workbox.routing.registerRoute(
  new RegExp("https://api.football-data.org/"),
  new workbox.strategies.NetworkFirst({
    networkTimeoutSeconds: 5,
    cacheName: 'cache-api',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24,
        maxEntries: 50,
      }),
    ],
  })
);
}
else
  console.log(`Workbox gagal dimuat`);


self.addEventListener('push', function (event) {
  var body;
  if (event.data) {
      body = event.data.text();
  } else {
      body = 'Push message no payload';
  }
  var options = {
      body: body,
      icon: 'icon.png',
      vibrate: [100, 50, 100],
      data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
      }
  };
  event.waitUntil(
      self.registration.showNotification('Push Notification', options)
  );
});