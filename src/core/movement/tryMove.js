import { collides } from '../pieces/collides.js';
import { resetLock } from './resetLock.js';
import { trackLowest } from './trackLowest.js';

/** Desplaza la pieza activa si cabe. Devuelve true si se movió. */
export function tryMove(g, dx, dy) {
  const p = g.cur;
  if (!p || collides(g.board, p, p.rot, p.x + dx, p.y + dy)) return false;
  p.x += dx; p.y += dy;
  if (dy > 0) { trackLowest(g); g.lastRotate = false; }
  if (dx) { g.lastRotate = false; resetLock(g); g.emit('move', { piece: p, dx }); }
  return true;
}
