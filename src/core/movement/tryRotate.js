import { collides } from '../pieces/collides.js';
import { rotationKicks } from './rotationKicks.js';
import { resetLock } from './resetLock.js';
import { trackLowest } from './trackLowest.js';

const NO_SPIN = new Set(['O', 'M', 'B', 'K']); // piezas que no cambian al girar

/** Gira la pieza activa (steps: 1 horario, -1 antihorario, 2 = 180°). Devuelve true si giró. */
export function tryRotate(g, steps) {
  const p = g.cur;
  if (!p || g.rules.rotate === false || NO_SPIN.has(p.type)) return false;
  const from = p.rot, to = (p.rot + steps + 4) % 4;
  const tests = rotationKicks(p.type, from, to, steps);
  for (let i = 0; i < tests.length; i++) {
    const [kx, ky] = tests[i];
    if (collides(g.board, p, to, p.x + kx, p.y + ky)) continue;
    p.x += kx; p.y += ky; p.rot = to;
    g.lastRotate = true; g.lastKick = i;
    trackLowest(g);
    resetLock(g);
    g.emit('rotate', { piece: p, steps, kick: i });
    return true;
  }
  return false;
}
