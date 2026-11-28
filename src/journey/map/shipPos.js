import { map } from './mapState.js';
import { travelEase } from './ship/travelEase.js';
import { routeAt } from './ship/routeAt.js';

const smooth = (x) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };

/**
 * Dónde está la nave: posada sobre su parada o recorriendo el trayecto. `flying` (0..1) dice
 * cuánto está en vuelo: al despegar baja al camino y al llegar vuelve a flotar sobre la parada.
 */
export function shipPos() {
  const s = map.ship, to = map.byId[s.id];
  if (!to) return null;
  if (!s.from || s.t >= 1 || !s.route) return { x: to.x, y: to.y, dx: 0, dy: 1, flying: 0, progress: 1 };
  const e = travelEase(s.t);
  const p = routeAt(s.route, e * s.route.len);
  return { ...p, flying: smooth(s.t / 0.12) * (1 - smooth((s.t - 0.82) / 0.18)), progress: Math.min(1, e) };
}
