import { drawStarDot } from './drawStarDot.js';

const pos = (s, cx, cy, size) => [cx + ((s[0] - 50) / 100) * size, cy + ((s[1] - 50) / 100) * size];

/**
 * Dibuja una constelación en un lienzo: trazos de luz (dos pasadas, ancha y fina, sin sombras
 * caras) y estrellas con halo según su brillo.
 * o.lines: 0..1 de trazos dibujados (para animarlo) · o.stars: 0..1 de estrellas encendidas ·
 * o.lit: encendida (dorada) o en espera (tenue) · o.color: color del tramo · o.alpha: opacidad.
 */
export function drawConstellation(ctx, sky, cx, cy, size, o = {}) {
  const { lines = 1, stars = 1, lit = true, color = '#9fd8ff', alpha = 1 } = o;
  const pts = sky.stars.map((s) => pos(s, cx, cy, size));
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = 'round';
  const total = sky.lines.length * lines;
  for (let pass = 0; pass < 2; pass++) {
    ctx.strokeStyle = lit ? (pass ? 'rgba(255,246,214,0.95)' : color) : (pass ? 'rgba(200,210,255,0.35)' : 'rgba(150,160,220,0.12)');
    ctx.lineWidth = Math.max(1, size * (pass ? 0.018 : 0.06)) * (lit ? 1 : 0.8);
    ctx.globalAlpha = alpha * (pass ? 1 : lit ? 0.32 : 1);
    ctx.beginPath();
    sky.lines.forEach(([a, b], i) => {
      const k = Math.max(0, Math.min(1, total - i));
      if (k <= 0) return;
      const [x1, y1] = pts[a], [x2, y2] = pts[b];
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k);
    });
    ctx.stroke();
  }
  const shown = sky.stars.length * stars;
  sky.stars.forEach((s, i) => {
    const k = Math.max(0, Math.min(1, shown - i));
    if (k > 0) drawStarDot(ctx, pts[i][0], pts[i][1], size * (0.025 + s[2] * 0.012) * (0.4 + 0.6 * k), lit ? color : '#8b93c9', alpha * k, lit);
  });
  ctx.restore();
}
