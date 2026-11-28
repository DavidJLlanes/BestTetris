const SIZE = 256;
const cache = new Map();

/** Nube de luz suave de dos colores (pre-dibujada una vez por par de colores). */
export function nebulaSprite(c1, c2) {
  const key = c1 + c2;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = SIZE;
  const ctx = c.getContext('2d');
  const blob = (x, y, r, color, a) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = a;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);
  };
  blob(SIZE * 0.42, SIZE * 0.5, SIZE * 0.5, c1, 0.9);
  blob(SIZE * 0.62, SIZE * 0.42, SIZE * 0.36, c2, 0.8);
  blob(SIZE * 0.5, SIZE * 0.6, SIZE * 0.22, '#ffffff', 0.18);
  cache.set(key, c);
  return c;
}
