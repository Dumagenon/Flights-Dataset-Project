
const cacheName = 'v1';
const dynamicCacheName = 'dynamic-cache-v0';

const staticAssets = [
  '../',
  '../index.html',
  '../css/main.css',
  './main.js'
];

self.addEventListener('install', async e => {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('[Service Working Cashing]');
        cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', async e => {
  e.waitUntil([
    self.clients.claim(),
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.map(cache => {
        if(![cacheName, dynamicCacheName].includes(cache)) {
          return caches.delete(cache);
        }
      }))
    })
  ]);
});

self.addEventListener('fetch', event => {
  console.log(`Trying to fetch ${event.request.url}`);
  event.respondWith(checkCache(event.request));
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
  } catch (error) {
    const cachedRes = await cache.match(req);
    if (cachedRes) {
      return cachedRes;
    } else if (req.url.indexOf('.html') !== -1) {
      return caches.match('../404.html');
    }
  }
}
