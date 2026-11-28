import { cellBase } from './base.js';

/** Hielo: cristal escarchado. Su fila no se limpia hasta que una línea vecina lo funde. */
export function paintIce(ctx, x, y, s) {
  const b = cellBase(ctx, x, y, s, '#f2fdff', '#5fb4dc');
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.moveTo(b.x0 + b.w * 0.12, b.y0 + b.w * 0.12);
  ctx.lineTo(b.x0 + b.w * 0.55, b.y0 + b.w * 0.12);
  ctx.lineTo(b.x0 + b.w * 0.12, b.y0 + b.w * 0.55);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = Math.max(1, s * 0.05);
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) { // copo de seis brazos
    const a = (i * Math.PI) / 3, r = b.w * 0.26;
    ctx.beginPath();
    ctx.moveTo(b.cx - Math.cos(a) * r, b.cy - Math.sin(a) * r);
    ctx.lineTo(b.cx + Math.cos(a) * r, b.cy + Math.sin(a) * r);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(30,110,170,0.55)';
  ctx.strokeRect(b.x0 + 0.5, b.y0 + 0.5, b.w - 1, b.w - 1);
}
