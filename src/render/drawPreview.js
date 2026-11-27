import { ROTATIONS } from '../core/pieces/rotations.js';
import { view } from './view.js';
import { gemSprite } from './sprites/gemSprite.js';

function bounds(cells) {
  const xs = cells.map((p) => p[0]), ys = cells.map((p) => p[1]);
  const minX = Math.min(...xs), minY = Math.min(...ys);
  return { minX, minY, w: Math.max(...xs) - minX + 1, h: Math.max(...ys) - minY + 1 };
}

/**
 * Dibuja piezas en un lienzo lateral (reserva o siguientes), en columna
 * o en fila (móvil). La primera pieza se ve algo más grande.
 */
export function drawPreview(ctx, types, slots, dim = false, row = view.previewRow) {
  const c = ctx.canvas, W = c.width / view.dpr, H = c.height / view.dpr;
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const n = row ? Math.min(slots, 3) : slots;
  const slotW = row ? W / n : W, slotH = row ? H : H / n;
  types.slice(0, n).forEach((t, i) => {
    if (!t) return;
    const cells = ROTATIONS[t][0];
    const b = bounds(cells);
    const s = Math.min((slotW * 0.9) / 4, (slotH * 0.85) / 2) * (i === 0 || n === 1 ? 1 : 0.82);
    const sprite = gemSprite(dim ? 'X' : t, Math.max(4, Math.round(s * view.dpr)));
    const ox = (row ? i * slotW : 0) + (slotW - b.w * s) / 2;
    const oy = (row ? 0 : i * slotH) + (slotH - b.h * s) / 2;
    ctx.globalAlpha = dim ? 0.6 : 1;
    for (const [x, y] of cells) ctx.drawImage(sprite, ox + (x - b.minX) * s, oy + (y - b.minY) * s, s, s);
  });
  ctx.globalAlpha = 1;
}
