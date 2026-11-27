import { COLS } from '../../config/board.js';

/**
 * Empuja el tablero hacia arriba y añade una fila de basura con un hueco.
 * Devuelve true si se ha salido algún bloque por arriba.
 */
export function addGarbageRow(board, hole) {
  const overflow = board[0].some(Boolean);
  board.shift();
  board.push(Array.from({ length: COLS }, (_, x) => (x === hole ? null : 'G')));
  return overflow;
}
