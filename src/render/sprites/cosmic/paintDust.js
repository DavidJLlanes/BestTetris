import { cellBase } from './base.js';

/** Granos fijos (siempre los mismos, para que el sprite no cambie entre tamaños). */
const GRAINS = [[0.22, 0.3], [0.62, 0.22], [0.4, 0.55], [0.75, 0.62], [0.28, 0.78], [0.55, 0.82], [0.82, 0.38]];

/** Polvo cósmico: roca gris granulada. Agrietada (cracked) tras la primera línea: a la segunda se rompe. */
export function paintDust(ctx, x, y, s, cracked) {
  const b = cellBase(ctx, x, y, s, cracked ? '#8d889f' : '#b3afc4', cracked ? '#3a3649' : '#4d4960');
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  for (const [gx, gy] of GRAINS) { ctx.beginPath(); ctx.arc(b.x0 + gx * b.w, b.y0 + gy * b.w, b.w * 0.05, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(b.x0, b.y0 + b.w * 0.72, b.w, b.w * 0.28);
  if (!cracked) return;
  ctx.strokeStyle = 'rgba(20,10,30,0.9)';
  ctx.lineWidth = Math.max(1, s * 0.07);
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(b.x0 + b.w * 0.15, b.y0 + b.w * 0.2);
  ctx.lineTo(b.x0 + b.w * 0.45, b.y0 + b.w * 0.45);
  ctx.lineTo(b.x0 + b.w * 0.38, b.y0 + b.w * 0.7);
  ctx.moveTo(b.x0 + b.w * 0.45, b.y0 + b.w * 0.45);
  ctx.lineTo(b.x0 + b.w * 0.85, b.y0 + b.w * 0.35);
  ctx.stroke();
}
