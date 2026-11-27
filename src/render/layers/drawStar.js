import { view } from '../view.js';

/**
 * Momento estelar en el tablero: las filas acumuladas brillan en oro al fondo, con su cuenta
 * grande, y una barra arriba marca el tiempo que queda.
 */
export function drawStar(ctx, g, now) {
  const s = g && g.custom.star;
  if (!s || !s.active) return;
  const cell = view.cell, W = view.width, H = view.height;
  // Tiempo detenido: un velo frío muy leve sobre el tablero
  ctx.fillStyle = 'rgba(120, 170, 255, 0.06)';
  ctx.fillRect(0, 0, W, H);
  if (s.stacked) {
    const top = H - s.stacked * cell;
    const pulse = 0.5 + 0.5 * Math.sin(now / 160);
    const grad = ctx.createLinearGradient(0, top, 0, H);
    grad.addColorStop(0, `rgba(255, 211, 79, ${0.28 + pulse * 0.12})`);
    grad.addColorStop(1, 'rgba(255, 160, 40, 0.18)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = grad;
    ctx.fillRect(0, top, W, H - top);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255, 240, 200, 0.9)';
    ctx.font = `900 ${Math.round(cell * (1.2 + Math.min(s.stacked, 12) * 0.08))}px system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.85;
    ctx.fillText(`×${s.stacked}`, W / 2, Math.max(cell * 1.5, top - cell * 1.2));
    ctx.globalAlpha = 1;
  }
  const k = s.ending ? 0 : s.time / (s.total || 1);
  ctx.fillStyle = 'rgba(255, 211, 79, 0.85)';
  ctx.fillRect(0, 0, W * k, Math.max(2, cell * 0.1));
}
