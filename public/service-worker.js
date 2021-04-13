const CACHE_NAME = 'my-site-cache-v1';
const DATA_CACHE = 'data-cache-v1';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/index.js',
    '/manifest.json',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Your files were pre-cached successfully!');
            return cache.addAll(FILES_TO_CACHE);
        })
    )
    self.skipWaiting();
})

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE) {
                        console.log('Removing old cache data ', key);
                        return cache.delete(key);
                    }
                })
            )
        })
    )
    self.skipWaiting();
})

self.addEventListener("fetch", (e) => {
    if (e.request.url.includes('/api/')) {
        e.respondWith(
            caches.match(e.request).then(function (req) {
                if (req) {
                    console.log("");
                    return req;
                }
                else {
                    console.log("File could not be cached");
                    return cache.match(e.req);
                }
            })
        )
        .catch(e => console.log(e));
        return;
    }
    e.respondWith(
        fetch(e.req).catch(() => {
            return caches.match(e.req).then((res) => {
                if (res) {
                    return res;
                }
                else if (e.req.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            })
        })
    )
})