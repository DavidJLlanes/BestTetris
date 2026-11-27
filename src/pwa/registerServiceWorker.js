/** Registra el service worker (no funciona en file:// ni en navegadores antiguos). */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
}
