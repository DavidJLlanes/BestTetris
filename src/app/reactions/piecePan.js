import { COLS } from '../../config/board.js';
import { SHAPES } from '../../config/shapes.js';

/** Posición estéreo de una pieza según su columna (-0.6 izquierda … 0.6 derecha). */
export function piecePan(piece) {
  if (!piece) return 0;
  const center = piece.x + SHAPES[piece.type].length / 2;
  return ((center / COLS) * 2 - 1) * 0.6;
}

/** Igual, a partir de las celdas ocupadas. */
export function cellsPan(cells) {
  const avg = cells.reduce((n, [x]) => n + x, 0) / cells.length + 0.5;
  return ((avg / COLS) * 2 - 1) * 0.6;
}
