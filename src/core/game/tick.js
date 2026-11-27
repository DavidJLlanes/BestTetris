import { CLEAR_ANIMATION, LOCK_DELAY, SOFT_DROP_FACTOR, SOFT_DROP_MAX_INTERVAL } from '../../config/timing.js';
import { SOFT_DROP_POINTS } from '../../config/scoring.js';
import { gravityInterval } from '../rules/gravityInterval.js';
import { onGround } from '../movement/onGround.js';
import { tryMove } from '../movement/tryMove.js';
import { finishClear } from './finishClear.js';
import { lockPiece } from './lockPiece.js';
import { finish } from './finish.js';

/** Avanza la partida dt segundos: animación de limpieza, gravedad y bloqueo. */
export function tick(g, dt) {
  if (g.over) return;
  g.time += dt;
  if (g.rules.timeLimit && g.time >= g.rules.timeLimit) { g.time = g.rules.timeLimit; finish(g, true); return; }
  if (g.hooks.onTick) { g.hooks.onTick(g, dt); if (g.over) return; }

  if (g.clearing) {
    g.clearing.t += dt;
    if (g.clearing.t >= CLEAR_ANIMATION) finishClear(g);
    return;
  }
  if (!g.cur) return;

  let interval = gravityInterval(g.level, g.rules.fixedInterval);
  if (g.softDrop) interval = Math.min(interval / SOFT_DROP_FACTOR, SOFT_DROP_MAX_INTERVAL);
  g.gravAcc += dt / interval;
  while (g.gravAcc >= 1) {
    g.gravAcc -= 1;
    if (!tryMove(g, 0, 1)) { g.gravAcc = 0; break; }
    if (g.softDrop) { g.score += SOFT_DROP_POINTS; g.emit('softDrop', {}); }
  }
  if (onGround(g)) g.gravAcc = 0;

  if (!onGround(g)) { g.lockTimer = 0; return; }
  g.lockTimer += dt;
  if (g.lockTimer >= LOCK_DELAY) lockPiece(g, false);
}
