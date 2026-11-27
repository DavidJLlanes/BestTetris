import { STAR_MIN, STAR_SECS } from '../../config/star.js';
import { starState, starEnabled } from './starState.js';

/**
 * Empieza el momento estelar: el tiempo se detiene (la pieza no cae sola) y las líneas que
 * hagas no desaparecen: se apilan abajo hasta el final. Dura más cuanto más lleno esté el medidor.
 */
export function startStar(g) {
  if (!starEnabled(g) || g.over || g.clearing) return false;
  const s = starState(g);
  if (s.active || s.charge < STAR_MIN) return false;
  Object.assign(s, { active: true, time: STAR_SECS * s.charge, total: STAR_SECS * s.charge, stacked: 0, ending: false, charge: 0 });
  g.gravAcc = 0;
  g.emit('starStart', { secs: s.time });
  return true;
}
