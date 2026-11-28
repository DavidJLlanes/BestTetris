import { map } from './mapState.js';
import { MAIN } from '../catalog.js';

const mainIndex = (id) => MAIN.findIndex((l) => l.id === id);

/** Punto del camino a la altura `seg` (índice de parada con decimales). */
export function pathAt(seg) {
  const pts = map.path;
  let i = pts.findIndex((p) => p.seg >= seg);
  if (i <= 0) return pts[Math.max(0, i)];
  const a = pts[i - 1], b = pts[i], t = (seg - a.seg) / (b.seg - a.seg || 1);
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Dónde está la nave: en su parada o, si viaja, a lo largo del camino (o del desvío). */
export function shipPos() {
  const s = map.ship, to = map.byId[s.id];
  if (!to) return null;
  if (!s.from || s.t >= 1) return to;
  const from = map.byId[s.from];
  const e = s.t < 0.5 ? 2 * s.t * s.t : 1 - (-2 * s.t + 2) ** 2 / 2; // acelera y frena
  const a = mainIndex(from.id), b = mainIndex(to.id);
  if (a >= 0 && b >= 0) return pathAt(a + (b - a) * e);
  return { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
}
