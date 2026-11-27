/*
 * PRISMA · service worker. Hace el juego instalable y jugable sin conexión.
 * Estrategia: responde al momento desde la caché y, en segundo plano, actualiza
 * la copia con la versión del servidor (stale-while-revalidate). Solo mismo origen.
 * Sube CACHE_VERSION al publicar cambios grandes para empezar con una caché limpia.
 */
const CACHE_VERSION = 'prisma-v2';
const SHELL = ['./', './index.html', './manifest.webmanifest', './assets/favicon.svg', './assets/icon-192.png', './assets/icon-512.png', './src/main.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE_VERSION).then(async (cache) => {
    const cached = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    const network = fetch(req).then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => cached);
    return cached || network;
  }));
});
