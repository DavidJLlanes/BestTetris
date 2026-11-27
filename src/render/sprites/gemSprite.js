import { COLORS } from '../../config/colors.js';
import { paintGem } from './paintGem.js';

const cache = new Map();
export const GLOW_PAD = 0.5; // margen del halo, en celdas

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = Math.ceil(size);
  return c;
}

/**
 * Gema pre-renderizada a resolución de pantalla. Dibujarla cada fotograma es
 * un simple drawImage, mucho más barato que degradados y sombras en vivo.
 * glow = true añade un halo alrededor (para la pieza activa).
 */
export function gemSprite(type, px, glow = false) {
  const key = `${type}|${px}|${glow}`;
  let c = cache.get(key);
  if (c) return c;
  const pad = glow ? Math.round(px * GLOW_PAD) : 0;
  c = canvas(px + pad * 2);
  const ctx = c.getContext('2d');
  if (glow) { ctx.shadowColor = COLORS[type][0]; ctx.shadowBlur = px * 0.45; }
  paintGem(ctx, pad, pad, px, type);
  cache.set(key, c);
  return c;
}

export function clearSpriteCache() { cache.clear(); }
