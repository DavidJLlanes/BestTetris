import { COLORS } from '../../config/colors.js';
import { roundRect } from '../roundRect.js';

function facet(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fill();
}

/** Pinta una gema facetada de lado s en (x, y). Solo se usa al crear sprites. */
export function paintGem(ctx, x, y, s, type) {
  const [c1, c2] = COLORS[type];
  const pad = Math.max(1, s * 0.06), r = s * 0.18;
  const x0 = x + pad, y0 = y + pad, w = s - pad * 2, k = w * 0.26;
  const g = ctx.createLinearGradient(x0, y0, x0 + w, y0 + w);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  roundRect(ctx, x0, y0, w, w, r);
  ctx.fill();
  facet(ctx, [[x0 + k, y0 + k], [x0 + w - k, y0 + k], [x0 + w - k * 1.4, y0 + w - k], [x0 + k * 1.4, y0 + w - k]], 'rgba(255,255,255,0.22)');
  facet(ctx, [[x0 + r, y0 + pad * 0.5], [x0 + w - r, y0 + pad * 0.5], [x0 + w - k, y0 + k], [x0 + k, y0 + k]], 'rgba(255,255,255,0.35)');
  facet(ctx, [[x0 + k * 1.4, y0 + w - k], [x0 + w - k * 1.4, y0 + w - k], [x0 + w - r, y0 + w], [x0 + r, y0 + w]], 'rgba(0,0,0,0.18)');
}
