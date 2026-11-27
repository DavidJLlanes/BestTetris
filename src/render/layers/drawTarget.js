import { HIDDEN } from '../../config/board.js';
import { COLORS } from '../../config/colors.js';
import { view } from '../view.js';
import { roundRect } from '../roundRect.js';

/** Silueta de destino (entrenador): late suavemente para guiar la vista sin tapar el tablero. */
export function drawTarget(ctx, g, now) {
  const cells = g.hooks.target && g.hooks.target(g);
  if (!cells) return;
  const cell = view.cell, color = COLORS[g.cur.type][0];
  const pulse = 0.5 + 0.5 * Math.sin(now / 260);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([cell * 0.22, cell * 0.14]);
  ctx.lineDashOffset = -now / 40;
  for (const [x, y] of cells) {
    if (y < HIDDEN) continue;
    roundRect(ctx, x * cell + 3, (y - HIDDEN) * cell + 3, cell - 6, cell - 6, cell * 0.2);
    ctx.globalAlpha = 0.08 + 0.1 * pulse; ctx.fill();
    ctx.globalAlpha = 0.55 + 0.4 * pulse; ctx.stroke();
  }
  ctx.restore();
}
