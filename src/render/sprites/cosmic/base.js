import { roundRect } from '../../roundRect.js';

/** Recuadro redondeado de una celda especial con un degradado diagonal. Devuelve su geometría. */
export function cellBase(ctx, x, y, s, c1, c2) {
  const pad = Math.max(1, s * 0.06), r = s * 0.18;
  const x0 = x + pad, y0 = y + pad, w = s - pad * 2;
  const g = ctx.createLinearGradient(x0, y0, x0 + w, y0 + w);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  roundRect(ctx, x0, y0, w, w, r);
  ctx.fill();
  return { x0, y0, w, r, cx: x0 + w / 2, cy: y0 + w / 2 };
}

/** Estrella de n puntas centrada en (cx, cy). */
export function starPath(ctx, cx, cy, outer, inner, n = 5, rot = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i * Math.PI) / n, r = i % 2 ? inner : outer;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
}
