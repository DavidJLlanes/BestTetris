import { pieceCells } from './pieceCells.js';
import { isBlocked } from '../board/isBlocked.js';

/** ¿La pieza chocaría con paredes, suelo o bloques en esa posición? */
export function collides(board, piece, rot = piece.rot, x = piece.x, y = piece.y) {
  return pieceCells(piece, rot, x, y).some(([cx, cy]) => isBlocked(board, cx, cy));
}
