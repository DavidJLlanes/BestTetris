import { drawConstellation } from '../art/drawConstellation.js';
import { nebulaSprite } from '../map/nebulaSprite.js';
import { tramoOf } from '../catalog.js';

let anim = 0;

/**
 * Ilustración grande de una constelación en un lienzo de ficha: nebulosa de su tramo detrás y
 * los trazos dibujándose en algo menos de un segundo. lit = conseguida (dorada) o en espera.
 */
export function drawArt(canvas, level, lit, { animate = true } = {}) {
  cancelAnimationFrame(anim);
  const dpr = Math.min(2, devicePixelRatio || 1);
  const w = canvas.clientWidth || 300, h = canvas.clientHeight || 180;
  canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  const t = tramoOf(level), neb = nebulaSprite(t.nebula[0], t.nebula[1]);
  const t0 = performance.now(), size = Math.min(w, h) * 0.92;
  const frame = (now) => {
    const k = animate ? Math.min(1, (now - t0) / 900) : 1;
    const e = 1 - (1 - k) ** 3;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = 0.55;
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(neb, w / 2 - size * 0.9, h / 2 - size * 0.7, size * 1.8, size * 1.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    drawConstellation(ctx, level.sky, w / 2, h / 2, size, { lines: e, stars: Math.min(1, e * 1.4), lit, color: t.nebula[0] });
    if (k < 1) anim = requestAnimationFrame(frame);
  };
  anim = requestAnimationFrame(frame);
}
