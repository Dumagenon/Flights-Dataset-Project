const cacheName = 'v1';
const dynamicCacheName = 'dynamic-cache-v0';

const staticAssets = [
  './',
  './index.html',
  './css/main.css',
  './js/main.js'
];

self.addEventListener('install', async e => {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('[Service Working Caching]');
        cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', async e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cache => {
        if(![cacheName, dynamicCacheName].includes(cache)) {
          return caches.delete(cache);
        }
      }))
    })
  );
});

self.addEventListener('fetch', e => {
  if (!(e.request.url.indexOf('http') === 0)) return;
  e.respondWith(checkCache(e.request));
});

async function checkCache(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || checkOnline(req);
}

async function checkOnline(req) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
  } catch (err) {
    return await cache.match(req);
  }
}
