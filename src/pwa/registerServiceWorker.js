import { app } from '../app/state.js';

/**
 * Registra el service worker (no funciona en file:// ni en navegadores antiguos).
 * Cuando llega una versión nueva del juego, recarga una sola vez para estrenarla,
 * pero nunca en mitad de una partida: espera a que vuelvas al menú.
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const hadController = !!navigator.serviceWorker.controller;
  let pending = false;
  const reloadWhenIdle = () => {
    if (app.screen === 'menu') { location.reload(); return; }
    if (!pending) { pending = true; setInterval(() => { if (app.screen === 'menu') location.reload(); }, 1000); }
  };
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) reloadWhenIdle(); });
  addEventListener('load', () => { navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {}); });
}
