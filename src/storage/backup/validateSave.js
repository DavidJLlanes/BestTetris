import { FORMAT, VERSION } from './format.js';
import { SAVE_KEYS } from '../keys.js';

/** Comprueba que un objeto es una copia de PRISMA válida. Devuelve un mensaje de error o null. */
export function validateSave(obj) {
  if (!obj || typeof obj !== 'object') return 'El archivo no es una copia de PRISMA.';
  if (obj.format !== FORMAT) return 'El archivo no es una copia de PRISMA.';
  if (!Number.isInteger(obj.version) || obj.version < 1) return 'La copia tiene una versión desconocida.';
  if (obj.version > VERSION) return 'La copia es de una versión más nueva de PRISMA. Actualiza la página.';
  if (!obj.data || typeof obj.data !== 'object') return 'La copia está vacía o dañada.';
  if (Object.keys(obj.data).some((k) => !SAVE_KEYS.includes(k))) return 'La copia contiene datos desconocidos.';
  const photo = obj.data.identity && obj.data.identity.photo;
  if (photo && !/^data:image\/(png|jpeg|webp);base64,/.test(photo)) return 'La foto de la copia no es válida.';
  return null;
}
