import { map } from './mapState.js';
import { routeAt } from './ship/routeAt.js';

const smooth = (x) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };

/**
 * Dónde está la nave: posada sobre su parada o recorriendo el trayecto. `flying` (0..1) dice
 * cuánto está en vuelo: según avanza baja poco a poco al camino y al acercarse vuelve a flotar.
 */
export function shipPos() {
  const s = map.ship, to = map.byId[s.id];
  if (!to) return null;
  if (!s.from || s.t >= 1 || !s.route) return { x: to.x, y: to.y, dx: 0, dy: 1, flying: 0, progress: 1 };
  const p = routeAt(s.route, s.d);
  const e = Math.min(1, Math.max(0, s.d / (s.route.len || 1)));
  return { ...p, flying: smooth(e / 0.32) * (1 - smooth((e - 0.68) / 0.32)), progress: e };
}
