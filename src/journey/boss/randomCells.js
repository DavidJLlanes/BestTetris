import { HIDDEN } from '../../config/board.js';

/** Hasta n celdas al azar que cumplan `pick(tipo)`, dentro de la zona visible. */
export function randomCells(g, n, pick) {
  const all = [];
  for (let y = HIDDEN; y < g.board.length; y++) g.board[y].forEach((c, x) => { if (pick(c)) all.push([x, y]); });
  const out = [];
  while (out.length < n && all.length) out.push(all.splice(Math.floor(g.random() * all.length), 1)[0]);
  return out;
}

/** Celdas ocupadas por bloques normales (no elementos especiales). */
export const plain = (c) => !!c && !'ADdCHK'.includes(c);

/** Celdas de la superficie: ocupadas y con hueco encima (el jefe ataca lo que se ve). */
export function surfaceCells(g, n) {
  return randomCells(g, n * 3, plain).filter(([x, y]) => !g.board[y - 1] || !g.board[y - 1][x]).slice(0, n);
}
