import { map } from './mapState.js';
import { clearNodeSprites } from './nodeSprite.js';

const MAX_PIXELS = 3.2e6; // tope de píxeles reales del lienzo (las tablets de alta densidad se ahogan)

/** Ajusta el lienzo al tamaño visible con una densidad que el dispositivo aguante a 60 fps. */
export function resizeMap(quality = map.quality || 1) {
  const c = map.canvas, r = c.getBoundingClientRect();
  const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
  const dpr = Math.max(1, Math.min(devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (w * h))) * quality);
  if (w === map.w && h === map.h && Math.abs(dpr - map.dpr) < 0.01) return;
  map.w = w; map.h = h; map.dpr = dpr; map.quality = quality;
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  map.k = Math.max(0.85, Math.min(1.55, Math.min(w, h * 0.66) / 400));
  map.anchorY = h * 0.6;
  map.spriteRes = Math.ceil(map.k * dpr * 1.35 * 4) / 4;
  map.tileDpr = Math.min(dpr, 1.5);
  clearNodeSprites();
}
