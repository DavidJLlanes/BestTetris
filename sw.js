/*
 * BestTris · service worker. Hace el juego instalable y jugable sin conexión.
 * Estrategia: todo se pide primero a la red (revalidando, así casi siempre es un 304 rápido)
 * para que página, estilos y módulos sean siempre de la misma versión; sin conexión sale de la caché.
 * Antes los módulos salían de la caché y tras un git pull se mezclaban versiones.
 * Sube CACHE_VERSION al publicar cambios grandes para empezar con una caché limpia.
 */
const CACHE_VERSION = 'besttris-v35';
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
  const key = req.mode === 'navigate' ? './index.html' : req;
  // Red primero y revalidando (cache: 'no-cache'): página, estilos y módulos siempre de la misma versión.
  // Sin conexión, la copia guardada.
  e.respondWith(caches.open(CACHE_VERSION).then((cache) => fetch(req, { cache: 'no-cache' })
    .then((res) => { if (res && res.ok) cache.put(key, res.clone()); return res; })
    .catch(() => cache.match(key, { ignoreSearch: true }).then((hit) => hit || Response.error()))));
});
