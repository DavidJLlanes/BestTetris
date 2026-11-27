import { runSync } from './runSync.js';
import { flushPush } from './schedulePush.js';
import { bootPending } from './bootSync.js';
import { loadMeta } from './syncMeta.js';
import { reloadOnMenu } from './reloadOnMenu.js';

const AWAY = 60 * 1000;

/** Trae lo de la cuenta y, si llegó algo nuevo de otro dispositivo, lo muestra. */
async function pullAndShow() {
  try { if ((await runSync({ pull: true })).changed) reloadOnMenu(); } catch { /* sin red: se reintenta luego */ }
}

/**
 * Con el juego en marcha: al salir de la app sube lo pendiente; al volver tras un rato trae lo nuevo;
 * al recuperar la conexión, reintenta.
 */
export function watchSync() {
  let hiddenAt = 0;
  if (bootPending()) pullAndShow();
  document.addEventListener('visibilitychange', () => {
    if (!loadMeta().user) return;
    if (document.hidden) { hiddenAt = Date.now(); flushPush(); return; }
    if (Date.now() - hiddenAt > AWAY) pullAndShow();
  });
  addEventListener('online', () => { if (loadMeta().user) pullAndShow(); });
}
