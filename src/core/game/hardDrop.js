import { HARD_DROP_POINTS } from '../../config/scoring.js';
import { ghostY } from '../movement/ghostY.js';
import { lockPiece } from './lockPiece.js';

/** Suelta la pieza de golpe y la bloquea. */
export function hardDrop(g) {
  const p = g.cur;
  if (!p) return;
  const from = p.y;
  const to = ghostY(g);
  if (to > from) g.lastRotate = false;
  p.y = to;
  g.score += (to - from) * HARD_DROP_POINTS;
  g.emit('hardDrop', { piece: { ...p }, from, distance: to - from });
  lockPiece(g, true);
}
