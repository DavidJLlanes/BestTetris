import { addGarbageRow } from '../board/addGarbageRow.js';
import { COLS } from '../../config/board.js';

/** Rellena el fondo del tablero con filas de basura al empezar (sin avisar de nada). */
export function seedGarbage(g, rows) {
  for (let i = 0; i < rows; i++) addGarbageRow(g.board, Math.floor(g.random() * COLS));
}
