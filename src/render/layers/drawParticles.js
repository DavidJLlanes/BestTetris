import { fx } from '../../effects/state.js';
import { view } from '../view.js';

/** Chispas con mezcla aditiva para que brillen. */
export function drawParticles(ctx) {
  if (!fx.particles.length) return;
  const cell = view.cell, scale = cell / 30;
  ctx.globalCompositeOperation = 'lighter';
  for (const p of fx.particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
    ctx.fillStyle = p.color;
    const s = p.size * scale;
    ctx.fillRect(p.x * cell - s / 2, p.y * cell - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}
