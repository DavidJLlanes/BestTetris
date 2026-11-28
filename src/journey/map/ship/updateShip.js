import { map } from '../mapState.js';

const STIFF = 60, DAMP = 11; // muelle del giro: se orienta con suavidad y un pelín de inercia

/** Avanza el viaje y hace girar la nave hacia donde va (o la endereza al posarse). */
export function updateShip(dt, targetAng) {
  const s = map.ship;
  if (s.t < 1) s.t = Math.min(1, s.t + dt / s.dur);
  let diff = targetAng - (s.ang || 0);
  diff = Math.atan2(Math.sin(diff), Math.cos(diff));
  s.angV = (s.angV || 0) + (diff * STIFF - (s.angV || 0) * DAMP) * dt;
  s.ang = (s.ang || 0) + s.angV * dt;
}
