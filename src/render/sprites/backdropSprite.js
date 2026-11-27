import { COLS, ROWS } from '../../config/board.js';

let cached = null, key = '';

/** Fondo del tablero con cuadrícula, cacheado hasta que cambie el tamaño o el ajuste. */
export function backdropSprite(cell, dpr, grid) {
  const k = `${cell}|${dpr}|${grid}`;
  if (cached && key === k) return cached;
  const W = COLS * cell, H = ROWS * cell;
  const c = document.createElement('canvas');
  c.width = W * dpr; c.height = H * dpr;
  const ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, 'rgba(20,14,52,0.94)');
  bg.addColorStop(1, 'rgba(10,7,30,0.97)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  if (grid) {
    ctx.strokeStyle = 'rgba(190,180,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < COLS; x++) { ctx.moveTo(x * cell + 0.5, 0); ctx.lineTo(x * cell + 0.5, H); }
    for (let y = 1; y < ROWS; y++) { ctx.moveTo(0, y * cell + 0.5); ctx.lineTo(W, y * cell + 0.5); }
    ctx.stroke();
  }
  cached = c; key = k;
  return c;
}
