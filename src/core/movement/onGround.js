import { collides } from '../pieces/collides.js';

/** ¿La pieza activa está apoyada? */
export function onGround(g) {
  const p = g.cur;
  return !!p && collides(g.board, p, p.rot, p.x, p.y + 1);
}
