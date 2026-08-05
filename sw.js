// service worker - 离线缓存 + 秒开
const CACHE = 'tom-v1';
const ASSETS = [
  './',
  './blog.html',
  './topics.html',
  './hits.html',
  './404.html',
  './feed.xml',
  './sitemap.xml',
  './robots.txt',
  './assets/bg-1.webp',
  './assets/bg-2.webp',
  './assets/bg-3.webp',
  './assets/bg-4.webp',
  './assets/bg-5.webp',
  './assets/bg-6.webp',
  './assets/js/fuse.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        // 只缓存同源 + 成功响应
        if (resp.ok && new URL(e.request.url).origin === location.origin) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
