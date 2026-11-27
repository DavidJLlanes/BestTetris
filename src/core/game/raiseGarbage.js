import { COLS } from '../../config/board.js';
import { addGarbageRow } from '../board/addGarbageRow.js';
import { collides } from '../pieces/collides.js';
import { topOut } from './topOut.js';

/** Sube `count` filas de basura; la pieza activa sube con ellas si hace falta. */
export function raiseGarbage(g, count = 1, rng = Math.random) {
  for (let i = 0; i < count; i++) {
    const overflow = addGarbageRow(g.board, Math.floor(rng() * COLS));
    if (g.cur && collides(g.board, g.cur)) g.cur.y--;
    if (overflow) { g.emit('garbage', { count: i + 1 }); topOut(g); return; }
  }
  g.emit('garbage', { count });
}
