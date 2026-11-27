import { COLS, TOTAL } from '../../config/board.js';

/** Tablero vacío: TOTAL filas de COLS celdas (null = vacía, letra = tipo de gema). */
export function createBoard() {
  return Array.from({ length: TOTAL }, () => Array(COLS).fill(null));
}
