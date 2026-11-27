import { COLS } from '../../config/board.js';

/**
 * Quita las filas indicadas y añade filas vacías arriba.
 * Devuelve el tablero nuevo y cuántas filas ha bajado cada fila resultante (para animarlo).
 */
export function removeRows(board, rows) {
  const kept = [], drops = [];
  board.forEach((row, y) => {
    if (rows.includes(y)) return;
    kept.push(row);
    drops.push(rows.filter((r) => r > y).length);
  });
  const empty = rows.length;
  const next = [...Array.from({ length: empty }, () => Array(COLS).fill(null)), ...kept];
  return { board: next, drops: [...Array(empty).fill(0), ...drops] };
}
