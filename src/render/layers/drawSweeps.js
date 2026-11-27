import { fx } from '../../effects/state.js';
import { view } from '../view.js';

/** Barrido de luz que cruza cada fila completada, de lado a lado. */
export function drawSweeps(ctx) {
  if (!fx.sweeps.length) return;
  const cell = view.cell, W = view.width;
  ctx.globalCompositeOperation = 'lighter';
  for (const s of fx.sweeps) {
    const k = s.t / s.life;
    const x = (k * 1.4 - 0.2) * W;
    const g = ctx.createLinearGradient(x - W * 0.35, 0, x + W * 0.1, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.8, s.color);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.globalAlpha = 0.6 * (1 - k * 0.6);
    ctx.fillStyle = g;
    ctx.fillRect(0, s.y * cell - cell * 0.1, W, cell * 1.2);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}
