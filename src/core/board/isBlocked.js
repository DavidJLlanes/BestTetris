import { COLS, TOTAL } from '../../config/board.js';

/** Una celda está bloqueada si está fuera del tablero (salvo por arriba) u ocupada. */
export function isBlocked(board, x, y) {
  if (x < 0 || x >= COLS || y >= TOTAL) return true;
  return y >= 0 && !!board[y][x];
}
