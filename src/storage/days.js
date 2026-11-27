import { load, save } from './store.js';
import { dateKey } from '../progress/dateKey.js';

/** Días jugados: { "AAAA-MM-DD": { g: partidas, l: líneas, xp } } para la racha y el calendario. */
export const loadDays = () => load('days', {});

export function addDay(lines, xp) {
  const all = loadDays(), k = dateKey();
  const d = all[k] || { g: 0, l: 0, xp: 0 };
  all[k] = { g: d.g + 1, l: d.l + lines, xp: d.xp + xp };
  save('days', all);
  return all;
}
