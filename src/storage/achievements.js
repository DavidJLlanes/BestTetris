import { load, save, onReplace } from './store.js';

/** Logros desbloqueados: { id: fecha }. */
let unlocked = null;
onReplace(() => { unlocked = null; });

export function getUnlocked() {
  if (!unlocked) unlocked = load('achievements', {});
  return unlocked;
}
export function markUnlocked(id) {
  getUnlocked()[id] = new Date().toLocaleDateString('es-ES');
  save('achievements', unlocked);
}
