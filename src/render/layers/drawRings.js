import { fx } from '../../effects/state.js';
import { view } from '../view.js';

/** Onda de la salpicadura al soltar: un óvalo de luz que se abre a ras de la pieza. */
export function drawRings(ctx) {
  if (!fx.rings.length) return;
  const cell = view.cell;
  ctx.globalCompositeOperation = 'lighter';
  for (const r of fx.rings) {
    const k = r.t / r.life, ease = 1 - (1 - k) ** 3;
    ctx.globalAlpha = 0.55 * (1 - k);
    ctx.strokeStyle = r.color;
    ctx.lineWidth = Math.max(1, cell * 0.12 * (1 - k));
    ctx.beginPath();
    ctx.ellipse(r.x * cell, r.y * cell, (r.w / 2 + ease * 1.6) * cell, (0.12 + ease * 0.35) * cell, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}
