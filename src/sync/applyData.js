import { SAVE_KEYS } from '../storage/keys.js';
import { save, notifyReplace } from '../storage/store.js';

/** Escribe en este navegador el progreso fusionado (sin marcarlo como cambio nuevo). */
export function applyData(data) {
  for (const key of SAVE_KEYS) if (key in data) save(key, data[key], { silent: true });
  notifyReplace();
}
