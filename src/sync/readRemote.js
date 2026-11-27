import { validateSave } from '../storage/backup/validateSave.js';
import { migrate } from '../storage/backup/migrate.js';

/** Convierte la copia de la cuenta en { data, stamps } del formato actual, o null si la cuenta está vacía. */
export function readRemote(save) {
  if (!save) return null;
  const error = validateSave(save);
  if (error) throw new Error(error); // nunca se pisa una copia que no entendemos (p. ej. de una versión más nueva)
  return { data: migrate(save.data, save.version), stamps: save.stamps || {} };
}
