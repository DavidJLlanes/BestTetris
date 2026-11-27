import { isBlocked } from '../board/isBlocked.js';
import { LAST_KICK_INDEX } from '../../config/kicks.js';

const CORNERS = [[0, 0], [2, 0], [2, 2], [0, 2]];
/** Esquinas "frontales" (hacia donde apunta la T) en cada orientación. */
const FRONT = [[0, 1], [1, 2], [2, 3], [3, 0]];

/** Regla de las 3 esquinas. Devuelve 'full', 'mini' o null. */
export function detectTSpin(board, piece, lastRotate, lastKick) {
  if (piece.type !== 'T' || !lastRotate) return null;
  const filled = CORNERS.map(([cx, cy]) => isBlocked(board, piece.x + cx, piece.y + cy));
  if (filled.filter(Boolean).length < 3) return null;
  const [a, b] = FRONT[piece.rot];
  return (filled[a] && filled[b]) || lastKick === LAST_KICK_INDEX ? 'full' : 'mini';
}
