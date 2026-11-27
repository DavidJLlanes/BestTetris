import { loadMeta } from './syncMeta.js';
import { syncNow } from './syncNow.js';
import { trackChanges } from './trackChanges.js';

let pending = false;

/**
 * Antes de arrancar el juego: con sesión abierta, trae el progreso de la cuenta (como mucho 2,5 s)
 * para que el menú salga ya con todo. Sin red se arranca igual con lo local y se reintenta después.
 */
export async function bootSync() {
  trackChanges();
  if (!loadMeta().user) return;
  try { await syncNow({ pull: true, timeout: 2500 }); } catch { pending = true; }
}

/** El arranque no pudo sincronizar: hay que reintentar ya con el juego en marcha. */
export const bootPending = () => pending;
