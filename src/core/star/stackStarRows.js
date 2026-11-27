import { COLS } from '../../config/board.js';

/**
 * Durante el momento estelar, las filas completas no se borran: bajan al fondo y se quedan
 * apiladas (encima de las que ya había) hasta el final. Devuelve el tablero nuevo.
 * stacked = filas estelares que ya ocupan el fondo; rows = filas completas nuevas.
 */
export function stackStarRows(board, rows, stacked) {
  const h = board.length;
  const bottom = board.slice(h - stacked);
  const top = board.slice(0, h - stacked).filter((_, y) => !rows.includes(y));
  const full = rows.map((y) => board[y]);
  const next = [...top, ...full, ...bottom];
  while (next.length < h) next.unshift(Array(COLS).fill(null));
  return next;
}
