import { HIDDEN } from '../../config/board.js';
import { view } from '../../render/view.js';
import { starPath } from '../../render/sprites/cosmic/base.js';

/**
 * Estrella fugaz sobre su fila: una franja dorada que se va vaciando con el tiempo que queda
 * y una estrella que recorre la fila de lado a lado con su estela.
 */
export function drawShooting(ctx, s, now) {
  const cell = view.cell, w = cell * 10, y = (s.y - HIDDEN) * cell;
  const left = 1 - s.t / s.life;
  const pulse = 0.5 + 0.5 * Math.sin(now / 140);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const band = ctx.createLinearGradient(0, y, 0, y + cell);
  band.addColorStop(0, 'rgba(255,214,110,0)');
  band.addColorStop(0.5, `rgba(255,214,110,${0.18 + pulse * 0.12})`);
  band.addColorStop(1, 'rgba(255,214,110,0)');
  ctx.fillStyle = band;
  ctx.fillRect(0, y - cell * 0.3, w, cell * 1.6);
  ctx.fillStyle = 'rgba(255,230,160,0.85)';
  ctx.fillRect(0, y + cell - 3, w * left, 3); // tiempo que queda
  const k = (now / 1600) % 1, x = k * (w + cell * 3) - cell * 1.5;
  const tail = ctx.createLinearGradient(x - cell * 3, 0, x, 0);
  tail.addColorStop(0, 'rgba(255,240,200,0)');
  tail.addColorStop(1, 'rgba(255,240,200,0.9)');
  ctx.strokeStyle = tail;
  ctx.lineWidth = cell * 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - cell * 3, y + cell * 0.5); ctx.lineTo(x, y + cell * 0.5); ctx.stroke();
  ctx.fillStyle = '#fffbe6';
  starPath(ctx, x, y + cell * 0.5, cell * 0.34, cell * 0.14, 5, now / 300);
  ctx.fill();
  ctx.restore();
}
