import { view } from '../../render/view.js';
import { roundRect } from '../../render/roundRect.js';

/** Barra de vida del jefe arriba del tablero: se vacía con cada golpe y destella al recibirlo. */
export function drawBossBar(ctx, b, name, now) {
  const w = view.cell * 10, h = Math.max(6, view.cell * 0.28), x = view.cell * 0.4, y = view.cell * 0.35;
  const full = w - x * 2, k = Math.max(0, b.hp / b.max);
  ctx.save();
  ctx.fillStyle = 'rgba(10,4,30,0.72)';
  roundRect(ctx, x, y, full, h, h / 2); ctx.fill();
  const bar = ctx.createLinearGradient(x, 0, x + full, 0);
  bar.addColorStop(0, '#ff3d6e'); bar.addColorStop(1, '#ffb13d');
  ctx.fillStyle = bar;
  if (k > 0) { roundRect(ctx, x, y, Math.max(h, full * k), h, h / 2); ctx.fill(); }
  if (b.flash > 0) { ctx.globalAlpha = b.flash; ctx.fillStyle = '#fff'; roundRect(ctx, x, y, full, h, h / 2); ctx.fill(); ctx.globalAlpha = 1; }
  ctx.font = `800 ${Math.round(view.cell * 0.36)}px system-ui, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillStyle = `rgba(255,220,230,${0.75 + 0.25 * Math.sin(now / 300)})`;
  ctx.fillText(`♛ ${name.toUpperCase()}`, x, y + h + view.cell * 0.42);
  ctx.textAlign = 'right';
  ctx.fillText(`${b.hp}/${b.max}`, x + full, y + h + view.cell * 0.42);
  ctx.restore();
}
