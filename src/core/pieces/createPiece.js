import { COLS, HIDDEN } from '../../config/board.js';
import { SHAPES } from '../../config/shapes.js';

/** Pieza nueva centrada justo encima de la zona visible. */
export function createPiece(type) {
  const size = SHAPES[type].length;
  return { type, rot: 0, x: Math.floor((COLS - size) / 2), y: HIDDEN - 1 };
}
