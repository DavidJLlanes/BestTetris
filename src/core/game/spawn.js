import { createPiece } from '../pieces/createPiece.js';
import { collides } from '../pieces/collides.js';
import { takeNext } from './takeNext.js';
import { topOut } from './topOut.js';
import { finish } from './finish.js';
import { isComplete } from './isComplete.js';
import { recordSnapshot } from '../undo/recordSnapshot.js';

/** Hace aparecer una pieza (la indicada o la siguiente de la cola). */
export function spawn(g, type = null) {
  const t = type || takeNext(g);
  if (!t) { finish(g, isComplete(g)); return; } // sin piezas: puzle resuelto o fallido
  const p = createPiece(t);
  g.cur = p;
  g.lockTimer = 0; g.resets = 0; g.lowestY = p.y; g.gravAcc = 0;
  g.lastRotate = false;
  if (collides(g.board, p)) { topOut(g); return; }
  if (!collides(g.board, p, p.rot, p.x, p.y + 1)) p.y++;
  g.lowestY = p.y;
  if (!type) recordSnapshot(g); // una pieza sacada de la reserva no es jugada nueva
  g.emit('spawn', { piece: p });
}
