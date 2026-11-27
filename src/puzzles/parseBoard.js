import { COLS } from '../config/board.js';

/**
 * Carga filas de texto en el fondo del tablero. Cada fila tiene 10 caracteres:
 * '.' vacío, 'G' roca o la letra de una pieza. La última fila es la de abajo.
 */
export function parseBoard(board, rows) {
  const offset = board.length - rows.length;
  rows.forEach((row, i) => {
    for (let x = 0; x < COLS; x++) {
      const c = row[x];
      board[offset + i][x] = c && c !== '.' ? c : null;
    }
  });
}
