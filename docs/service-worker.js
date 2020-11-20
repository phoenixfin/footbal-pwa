importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log(`Workbox berhasil dimuat`);
} else {
    console.log(`Workbox gagal dimuat`);
}

workbox.precaching.precacheAndRoute([
    { url: "/nav.html", revision: 1},
    { url: "/index.html", revision: 1},
    { url: "/team.html", revision: 1},
    { url: "/pages/home.html", revision: 1},
    { url: "/pages/about.html", revision: 1},
    { url: "/pages/teams.html", revision: 1},
    { url: "/pages/matches.html", revision: 1},
    { url: "/pages/saved.html", revision: 1},
    { url: "/css/materialize.min.css", revision: 1},
    { url: "/js/materialize.min.js", revision: 1},
    { url: "/manifest.json", revision: 1},
    { url: "/js/nav.js", revision: 1},
    { url: "/js/init.js", revision: 1},
    { url: "/js/api.js", revision: 1},
    { url: "/js/db.js", revision: 1},
    { url: "/js/idb.js", revision: 1},
    { url: "/js/push.js", revision: 1},
    { url: "/icon.png", revision: 1},
    { url: "https://fonts.googleapis.com/icon?family=Material+Icons", revision: 1},
    { url: "https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2", revision: 1},
]);

workbox.routing.registerRoute(
    new RegExp('/team.html'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'team-data'
    })
);

workbox.routing.registerRoute(
    new RegExp('/'),
    workbox.strategies.cacheFirst({
        cacheName: 'main'
    })
);

workbox.routing.registerRoute(
    new RegExp('/pages/'),
    workbox.strategies.cacheFirst({
        cacheName: 'pages'
    })
);

workbox.routing.registerRoute(
    new RegExp('/css/'),
    workbox.strategies.networkFirst({
        cacheName: 'stylesheet'
    })
);

workbox.routing.registerRoute(
    new RegExp('/js/'),
    workbox.strategies.cacheFirst({
        cacheName: 'javascript'
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    workbox.strategies.cacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org\/v2/,
    workbox.strategies.cacheFirst({
        cacheName: 'api-data',
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: '/icon.png',
        badge: '/icon.png',
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