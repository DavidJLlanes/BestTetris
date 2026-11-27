import { starState, starEnabled } from './starState.js';

/** Cuenta atrás del momento estelar. Al agotarse, la gravedad vuelve y se libera al fijar la pieza. */
export function tickStar(g, dt) {
  if (!starEnabled(g)) return;
  const s = starState(g);
  if (!s.active || s.ending) return;
  s.time -= dt;
  if (s.time <= 0) { s.time = 0; s.ending = true; g.emit('starTimeUp', {}); }
}
export const starFrozen = (g) => { const s = g.custom.star; return !!(s && s.active && !s.ending); };
