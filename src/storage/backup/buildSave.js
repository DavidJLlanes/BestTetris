import { SAVE_KEYS } from '../keys.js';
import { load } from '../store.js';
import { FORMAT, VERSION } from './format.js';

/** Reúne todo el progreso guardado en un único objeto exportable. */
export function buildSave() {
  const data = {};
  for (const key of SAVE_KEYS) {
    const v = load(key, undefined);
    if (v !== undefined) data[key] = v;
  }
  return { format: FORMAT, version: VERSION, exportedAt: new Date().toISOString(), data };
}
