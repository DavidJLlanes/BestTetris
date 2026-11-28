import { tryMove } from '../../core/movement/tryMove.js';

const EVERY = 1.6; // segundos entre tirones
const REACH = 3; // columnas a las que llega la atracción

/** Columna del agujero negro más alto del tablero, o -1. */
function holeColumn(board) {
  for (let y = 0; y < board.length; y++) { const x = board[y].indexOf('H'); if (x >= 0) return x; }
  return -1;
}

/** Los agujeros negros atraen la pieza que cae: cada poco la acercan una columna (si cabe). */
export function holePull(g, dt) {
  const c = g.custom;
  if (!c.holePull || !g.cur) return;
  c.pullT = (c.pullT || 0) + dt;
  if (c.pullT < EVERY) return;
  c.pullT = 0;
  const hx = holeColumn(g.board);
  if (hx < 0) return;
  const px = g.cur.x + 1;
  if (px === hx || Math.abs(px - hx) > REACH) return;
  if (tryMove(g, Math.sign(hx - px), 0)) g.emit('holePull', { dir: Math.sign(hx - px) });
}
