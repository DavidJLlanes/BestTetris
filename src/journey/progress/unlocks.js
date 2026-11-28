import { MAIN, getLevel } from '../catalog.js';
import { TRAMOS } from '../tramos.js';
import { starsOf, totalStars } from './stars.js';

/** Por qué está cerrada una constelación (null si está abierta). */
export function lockReason(level, p) {
  if (level.kind === 'hidden') {
    const from = getLevel(level.branchFrom);
    return starsOf(p, from.id) >= 3 ? null : `Consigue 3 estrellas en ${from.sky.name} para abrir este desvío`;
  }
  if (level.kind === 'event') return starsOf(p, MAIN[5].id) > 0 ? null : 'Vence al Dragón para ver las lluvias de estrellas';
  const i = MAIN.indexOf(level);
  if (i === 0) return null;
  const prev = MAIN[i - 1];
  if (starsOf(p, prev.id) < 1) return `Supera antes ${prev.sky.name}`;
  if (level.pos === 0) {
    const need = TRAMOS[level.tramo].gate, have = totalStars(p);
    if (have < need) return `Necesitas ${need} estrellas para cruzar a ${TRAMOS[level.tramo].name} (tienes ${have})`;
  }
  return null;
}

export const isOpen = (level, p) => lockReason(level, p) === null;

/** El planeta tienda de un tramo se abre al vencer a su jefe. */
export const shopOpen = (tramo, p) => starsOf(p, MAIN[tramo * 6 + 5].id) > 0;

/** La siguiente constelación del camino por jugar (la primera abierta sin estrellas), o la última. */
export function frontier(p) {
  return MAIN.find((l) => isOpen(l, p) && starsOf(p, l.id) === 0) || [...MAIN].reverse().find((l) => isOpen(l, p)) || MAIN[0];
}
