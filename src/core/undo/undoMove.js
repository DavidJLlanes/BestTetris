import { createPiece } from '../pieces/createPiece.js';
import { collides } from '../pieces/collides.js';
import { canUndo, undoCost } from './undoCost.js';

/**
 * Deshace la última pieza colocada: vuelve al momento en que apareció y la devuelve
 * a lo alto. Cuesta puntos (cada vez más) y queda apuntado en las estadísticas.
 */
export function undoMove(g) {
  if (!canUndo(g)) return false;
  const cost = undoCost(g);
  g.history.pop(); // la pieza actual
  const s = g.history[g.history.length - 1];
  const undos = g.stats.undos + 1;
  Object.assign(g, { board: s.board.map((r) => r.slice()), queue: s.queue.slice(), hold: s.hold, holdUsed: s.holdUsed, lines: s.lines, level: s.level, combo: s.combo, b2b: s.b2b, custom: structuredClone(s.custom) });
  g.stats = { ...s.stats, undos, undoPoints: g.stats.undoPoints + cost };
  // La foto puede ser de antes de otros deshaceres: se descuenta todo lo pagado desde entonces
  g.score = Math.max(0, s.score - (g.stats.undoPoints - s.stats.undoPoints));
  const p = createPiece(s.type);
  if (!collides(g.board, p, p.rot, p.x, p.y + 1)) p.y++;
  Object.assign(g, { cur: p, lockTimer: 0, resets: 0, lowestY: p.y, gravAcc: 0, lastRotate: false, softDrop: false });
  g.emit('undo', { piece: p, cost, left: g.rules.undo - undos });
  return true;
}
