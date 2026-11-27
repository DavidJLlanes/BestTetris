import { pieceCells } from '../core/pieces/pieceCells.js';
import { collides } from '../core/pieces/collides.js';
import { createPiece } from '../core/pieces/createPiece.js';

/**
 * Celdas donde debe acabar una pieza guiada. El objetivo es { rot, x } (cae recto)
 * o { rot, x, y } si hace falta un giro final (como en un giro-T).
 */
export function targetCells(board, type, target) {
  const p = { ...createPiece(type), rot: target.rot, x: target.x, y: target.y ?? 0 };
  if (target.y === undefined) while (!collides(board, p, p.rot, p.x, p.y + 1)) p.y++;
  return pieceCells(p);
}

export const sameCells = (a, b) => a.length === b.length && a.every(([x, y]) => b.some(([u, v]) => u === x && v === y));
