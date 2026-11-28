import { MAIN } from '../catalog.js';
import { isOpen } from './unlocks.js';

/** La parada siguiente del camino tras una constelación, si ya está abierta (si no, null). */
export function nextStop(level, p) {
  const i = MAIN.findIndex((l) => l.id === level.id);
  if (i < 0 || i === MAIN.length - 1) return null;
  return isOpen(MAIN[i + 1], p) ? MAIN[i + 1].id : null;
}
