const cacheName = "v1";
const cacheAssets = [
    "/index.js",
    "/styles.css",
    "/",
    "/icons/favicon.png",
    "/icons/logo.png",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
    "https://code.jquery.com/jquery-3.5.1.slim.min.js",
    "https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js",
];

self.addEventListener("install", (ev) => {
    ev.waitUntil(
        caches.open(cacheName).then(cache => {
            cache.addAll(cacheAssets);
        }).then(() => {
            self.skipWaiting();
        })
    );
});


self.addEventListener("activate", (ev) => {
    ev.waitUntil(
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.filter(function(cacheName) {
            }).map(function(cacheName) {
              return caches.delete(cacheName);
            })
          );
        })
    );
});


self.addEventListener("fetch", (ev) => {
    ev.respondWith(
        fetch(ev.request).then(function(res) {
            return res;
        }).catch(function(err) {
            return caches.match(ev.request);
        })
    );
});