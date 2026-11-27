import { collides } from '../pieces/collides.js';

/** Fila en la que caería la pieza activa. */
export function ghostY(g) {
  const p = g.cur;
  let y = p.y;
  while (!collides(g.board, p, p.rot, p.x, y + 1)) y++;
  return y;
}
