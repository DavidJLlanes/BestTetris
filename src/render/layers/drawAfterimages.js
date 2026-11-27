import { HIDDEN } from '../../config/board.js';
import { fx } from '../../effects/state.js';
import { view } from '../view.js';
import { roundRect } from '../roundRect.js';

/** Estelas de luz que deja la pieza al moverse o girar: su silueta se desvanece en ~150 ms. */
export function drawAfterimages(ctx) {
  if (!fx.afterimages.length) return;
  const cell = view.cell;
  ctx.globalCompositeOperation = 'lighter';
  for (const a of fx.afterimages) {
    const k = 1 - a.t / a.life;
    ctx.globalAlpha = 0.22 * k * k;
    ctx.fillStyle = a.color;
    for (const [x, y] of a.cells) {
      if (y < HIDDEN) continue;
      const m = cell * (0.1 + 0.15 * (1 - k));
      roundRect(ctx, x * cell + m, (y - HIDDEN) * cell + m, cell - m * 2, cell - m * 2, cell * 0.2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}
