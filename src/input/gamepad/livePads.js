import { padActive } from './readPad.js';

const used = new Set();

/**
 * Mandos que se han usado alguna vez, en orden. Un receptor inalámbrico de Xbox expone
 * ranuras «conectadas» sin mando: no cuentan hasta que se pulse algo en ellas.
 */
export function livePads() {
  if (!navigator.getGamepads) return [];
  const pads = Array.from(navigator.getGamepads()).filter((p) => p && p.connected);
  pads.forEach((p) => { if (padActive(p)) used.add(p.id + '#' + p.index); });
  return pads.filter((p) => used.has(p.id + '#' + p.index));
}
