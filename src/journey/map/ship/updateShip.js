import { map } from '../mapState.js';
import { flightStep } from './flightStep.js';

const STIFF = 42, DAMP = 11.5; // muelle del giro: se orienta con suavidad, casi sin pasarse

/** Avanza el viaje, gira la nave hacia donde va (o la endereza al posarse) y su fundido. */
export function updateShip(dt, targetAng) {
  const s = map.ship;
  if (s.from && s.t < 1 && s.route) {
    const done = flightStep(s, dt);
    s.t = done ? 1 : Math.min(0.999, s.time / s.dur);
    if (done) s.d = s.route.len;
  }
  let diff = targetAng - (s.ang || 0);
  diff = Math.atan2(Math.sin(diff), Math.cos(diff));
  for (let left = dt; left > 1e-6; left -= 1 / 120) { // en pasos cortos: estable aunque el móvil vaya a tirones
    const h = Math.min(1 / 120, left);
    s.angV = (s.angV || 0) + (diff * STIFF - (s.angV || 0) * DAMP) * h;
    s.ang = (s.ang || 0) + s.angV * h;
    diff -= s.angV * h;
  }
  const a = s.alpha ?? 1, to = s.alphaTo ?? 1;
  s.alpha = a + (to - a) * (1 - Math.exp(-10 * dt));
}
