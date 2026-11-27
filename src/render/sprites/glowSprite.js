/** Punto de luz difuso de un color (para las chispas), dibujado una sola vez y reutilizado. */
const cache = new Map();

export function glowSprite(color) {
  let c = cache.get(color);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 32;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18, color);
  g.addColorStop(0.5, color.length === 7 ? `${color}55` : color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  cache.set(color, c);
  return c;
}
