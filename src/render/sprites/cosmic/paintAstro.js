import { cellBase, starPath } from './base.js';

/** Astro: una estrella dorada engastada en cristal oscuro. Se recoge al limpiar su fila. */
export function paintAstro(ctx, x, y, s) {
  const b = cellBase(ctx, x, y, s, '#3b2a6e', '#140a33');
  const halo = ctx.createRadialGradient(b.cx, b.cy, 0, b.cx, b.cy, b.w * 0.55);
  halo.addColorStop(0, 'rgba(255,214,110,0.85)');
  halo.addColorStop(1, 'rgba(255,214,110,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(b.x0, b.y0, b.w, b.w);
  const g = ctx.createLinearGradient(b.x0, b.y0, b.x0, b.y0 + b.w);
  g.addColorStop(0, '#fffbe6');
  g.addColorStop(1, '#ffb43d');
  ctx.fillStyle = g;
  starPath(ctx, b.cx, b.cy + b.w * 0.03, b.w * 0.4, b.w * 0.17);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.strokeRect(b.x0 + 0.5, b.y0 + 0.5, b.w - 1, b.w - 1);
}
