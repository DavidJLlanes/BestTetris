import { load, save } from './store.js';

/** Mejores repeticiones guardadas, una por récord (modo, o modo y día en el desafío diario). */
export function loadReplay(key) { return load('replays', {})[key] || null; }

export function saveReplay(key, replay) {
  const all = load('replays', {});
  // Los desafíos diarios caducan: solo se guarda el de hoy
  for (const k of Object.keys(all)) if (k.startsWith('daily-') && k !== key) delete all[k];
  all[key] = replay;
  save('replays', all);
}
