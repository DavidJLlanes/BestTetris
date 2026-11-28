import { map } from '../mapState.js';

/** Radio de la parada bajo la nave: en vuelo pasa del de salida al de llegada sin saltos. */
export function hoverRadius(progress = 1) {
  const s = map.ship, to = map.byId[s.id], from = s.from && map.byId[s.from];
  const rt = to ? to.r : 34;
  if (!from || s.t >= 1) return rt;
  return from.r + (rt - from.r) * progress;
}
