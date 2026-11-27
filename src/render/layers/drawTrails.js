import { fx } from '../../effects/state.js';
import { view } from '../view.js';

/** Estelas verticales de la caída rápida: columnas de luz que se desvanecen. */
export function drawTrails(ctx) {
  const cell = view.cell;
  for (const t of fx.trails) {
    const k = 1 - t.t / t.life;
    const top = t.y0 * cell, bottom = t.y1 * cell;
    const g = ctx.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, t.color);
    ctx.globalAlpha = 0.35 * k;
    ctx.fillStyle = g;
    const w = cell * (0.9 - 0.3 * (1 - k));
    ctx.fillRect(t.x * cell + (cell - w) / 2, top, w, bottom - top);
  }
  ctx.globalAlpha = 1;
}
