import { SAVE_KEYS } from '../storage/keys.js';
import { save, remove, notifyReplace } from '../storage/store.js';
import { buildSave } from '../storage/backup/buildSave.js';
import { saveStamps } from './stamps.js';

const KEEP = ['settings', 'muted']; // ajustes y sonido son del dispositivo, no del jugador

/**
 * Al entrar con otra cuenta en este dispositivo, el progreso de la cuenta anterior no se mezcla:
 * se aparta (guardado aparte en este navegador) y se empieza con el de la cuenta nueva.
 */
export function stashLocal(previousUser) {
  save('syncStash', { user: previousUser, save: buildSave() }, { silent: true });
  for (const key of SAVE_KEYS) if (!KEEP.includes(key)) remove(key);
  saveStamps({});
  notifyReplace();
}
