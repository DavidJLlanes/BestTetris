import { ROTATIONS } from './rotations.js';

/** Celdas absolutas [x, y] de una pieza, opcionalmente en otra posición o giro. */
export function pieceCells(piece, rot = piece.rot, x = piece.x, y = piece.y) {
  return ROTATIONS[piece.type][rot].map(([cx, cy]) => [x + cx, y + cy]);
}
