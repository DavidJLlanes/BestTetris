import { HIDDEN } from '../../config/board.js';
import { COLORS } from '../../config/colors.js';
import { pieceCells } from '../../core/pieces/pieceCells.js';
import { ghostY } from '../../core/movement/ghostY.js';
import { view } from '../view.js';
import { motion } from '../motion/state.js';
import { roundRect } from '../roundRect.js';

/** Silueta de dónde caerá la pieza. Sigue la posición horizontal suavizada. */
export function drawGhost(ctx, g) {
  const p = g.cur;
  const cell = view.cell, color = COLORS[p.type][0];
  const gy = ghostY(g);
  const ox = (motion.x - p.x) * cell;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  for (const [cx, cy] of pieceCells(p, p.rot, p.x, gy)) {
    if (cy < HIDDEN) continue;
    roundRect(ctx, cx * cell + 2 + ox, (cy - HIDDEN) * cell + 2, cell - 4, cell - 4, cell * 0.18);
    ctx.globalAlpha = 0.14; ctx.fill();
    ctx.globalAlpha = 0.5; ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
