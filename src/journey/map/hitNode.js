import { map } from './mapState.js';

/** Parada bajo el punto (x, y) de pantalla, con margen para el dedo. */
export function hitNode(x, y) {
  let best = null, bestD = Infinity;
  for (const h of map.hit) {
    const d = Math.hypot(h.x - x, h.y - y);
    if (d < Math.max(h.r * 1.25, 26) && d < bestD) { best = h.node; bestD = d; }
  }
  return best;
}
