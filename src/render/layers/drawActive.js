import { HIDDEN } from '../../config/board.js';
import { SHAPES } from '../../config/shapes.js';
import { LOCK_DELAY } from '../../config/timing.js';
import { ROTATIONS } from '../../core/pieces/rotations.js';
import { onGround } from '../../core/movement/onGround.js';
import { view } from '../view.js';
import { motion } from '../motion/state.js';
import { gemSprite, GLOW_PAD } from '../sprites/gemSprite.js';

/** Pieza activa en su posición suavizada, con giro animado y halo. */
export function drawActive(ctx, g) {
  const p = g.cur;
  const cell = view.cell, px = Math.round(cell * view.dpr);
  const size = SHAPES[p.type].length;
  const fade = onGround(g) ? 1 - 0.3 * (g.lockTimer / LOCK_DELAY) : 1;
  const sprite = gemSprite(p.type, px, true);
  const pad = GLOW_PAD * cell;
  const cx = (motion.x + size / 2) * cell, cy = (motion.y - HIDDEN + size / 2) * cell;

  ctx.save();
  ctx.translate(cx, cy);
  if (motion.angle) ctx.rotate(motion.angle);
  if (motion.scale !== 1) ctx.scale(motion.scale, motion.scale);
  ctx.globalAlpha = fade * motion.alpha;
  for (const [x, y] of ROTATIONS[p.type][p.rot]) {
    const dx = (x - size / 2) * cell, dy = (y - size / 2) * cell;
    if (cy + dy < -cell) continue;
    ctx.drawImage(sprite, dx - pad, dy - pad, cell + pad * 2, cell + pad * 2);
  }
  ctx.restore();
}
