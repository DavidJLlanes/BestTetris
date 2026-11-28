import { map } from '../mapState.js';

/** Punto del camino a la altura `seg` (índice de parada con decimales). */
export function pathAt(seg) {
  const pts = map.path;
  let i = pts.findIndex((p) => p.seg >= seg);
  if (i === -1) i = pts.length - 1;
  if (i <= 0) return pts[0];
  const a = pts[i - 1], b = pts[i], t = (seg - a.seg) / (b.seg - a.seg || 1);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
