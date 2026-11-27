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
  // Balanceo en profundidad: la pieza se estrecha y se inclina como un objeto con volumen
  const t = motion.tilt;
  if (t) ctx.transform(1 - Math.abs(t) * 0.12, t * 0.1, 0, 1 - Math.abs(t) * 0.03, 0, 0);
  ctx.globalAlpha = fade * motion.alpha;
  for (const [x, y] of ROTATIONS[p.type][p.rot]) {
    const dx = (x - size / 2) * cell, dy = (y - size / 2) * cell;
    if (cy + dy < -cell) continue;
    ctx.drawImage(sprite, dx - pad, dy - pad, cell + pad * 2, cell + pad * 2);
    if (Math.abs(t) > 0.04) drawSheen(ctx, dx, dy, cell, t);
  }
  ctx.restore();
}

/** Reflejo que recorre la gema al balancearse: la luz cambia de cara como en un objeto 3D. */
function drawSheen(ctx, dx, dy, cell, t) {
  const m = cell * 0.08, w = cell - m * 2;
  const at = 0.5 - t * 0.45;
  const g = ctx.createLinearGradient(dx + m, dy + m, dx + m + w, dy + m + w);
  g.addColorStop(Math.max(0, at - 0.22), 'rgba(255,255,255,0)');
  g.addColorStop(Math.min(1, Math.max(0, at)), `rgba(255,255,255,${(Math.abs(t) * 0.45).toFixed(3)})`);
  g.addColorStop(Math.min(1, at + 0.22), 'rgba(255,255,255,0)');
  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(dx + m, dy + m, w, w, cell * 0.18) : ctx.rect(dx + m, dy + m, w, w);
  ctx.fill();
  ctx.globalCompositeOperation = prev;
}
