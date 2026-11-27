import { STAR_CHARGE } from '../../config/star.js';
import { starState, starEnabled } from './starState.js';

/** Las líneas hechas fuera del momento estelar llenan el medidor. */
export function chargeStar(g, lines) {
  if (!starEnabled(g) || !lines) return;
  const s = starState(g);
  if (s.active) return;
  const before = s.charge;
  s.charge = Math.min(1, s.charge + STAR_CHARGE[Math.min(4, lines)]);
  if (s.charge !== before) g.emit('starCharge', { charge: s.charge, ready: s.charge >= 0.5 && before < 0.5, full: s.charge >= 1 && before < 1 });
}
