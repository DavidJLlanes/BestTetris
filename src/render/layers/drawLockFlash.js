import { HIDDEN } from '../../config/board.js';
import { fx } from '../../effects/state.js';
import { view } from '../view.js';
import { roundRect } from '../roundRect.js';

export const LOCK_FLASH_TIME = 0.16;

/** Brillo blanco breve sobre la pieza recién fijada. */
export function drawLockFlash(ctx) {
  const f = fx.lockFlash;
  if (!f) return;
  const cell = view.cell;
  ctx.fillStyle = `rgba(255,255,255,${(f.t / LOCK_FLASH_TIME) * 0.5})`;
  for (const [x, y] of f.cells) {
    if (y < HIDDEN) continue;
    roundRect(ctx, x * cell + 1, (y - HIDDEN) * cell + 1, cell - 2, cell - 2, cell * 0.18);
    ctx.fill();
  }
}
