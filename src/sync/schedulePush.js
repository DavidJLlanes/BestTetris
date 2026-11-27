import { runSync } from './runSync.js';

const DELAY = 4000;
let timer = 0;

/** Sube los cambios unos segundos después del último (así un final de partida es una sola subida). */
export function schedulePush() {
  clearTimeout(timer);
  timer = setTimeout(() => runSync({ pull: false }).catch(() => {}), DELAY);
}

/** Sube ya lo pendiente (al salir de la app). */
export function flushPush() {
  clearTimeout(timer);
  return runSync({ pull: false, keepalive: true }).catch(() => {});
}
