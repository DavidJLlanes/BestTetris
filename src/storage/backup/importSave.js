import { save } from '../store.js';
import { SAVE_KEYS } from '../keys.js';
import { validateSave } from './validateSave.js';
import { migrate } from './migrate.js';

/**
 * Lee un archivo de copia y sustituye el progreso actual.
 * Devuelve { ok: true } o { ok: false, error }.
 */
export async function importSave(file) {
  let obj;
  try { obj = JSON.parse(await file.text()); } catch { return { ok: false, error: 'No se ha podido leer el archivo.' }; }
  const error = validateSave(obj);
  if (error) return { ok: false, error };
  const data = migrate(obj.data, obj.version);
  for (const key of SAVE_KEYS) if (key in data) save(key, data[key]);
  return { ok: true };
}
