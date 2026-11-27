import { fx } from '../../effects/state.js';
import { view } from '../view.js';
import { glowSprite } from '../sprites/glowSprite.js';
import { musicPulse } from '../../audio/index.js';

/** Chispas como puntos de luz con mezcla aditiva; laten un poco con el pulso de la música. */
export function drawParticles(ctx) {
  if (!fx.particles.length) return;
  const cell = view.cell, scale = cell / 30;
  const beat = 1 + musicPulse() * 0.5;
  ctx.globalCompositeOperation = 'lighter';
  for (const p of fx.particles) {
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
    const s = p.size * scale * 3.2 * beat;
    ctx.drawImage(glowSprite(p.color), p.x * cell - s / 2, p.y * cell - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}
