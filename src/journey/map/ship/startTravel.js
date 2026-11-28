import { map } from '../mapState.js';
import { travelRoute } from './travelRoute.js';
import { getJourney, saveJourney } from '../../progress/journeyStore.js';

/** La nave despega de una parada hacia otra; la duración depende de lo largo del trayecto. */
export function startTravel(fromId, toId) {
  const from = map.byId[fromId], to = map.byId[toId];
  const route = travelRoute(from, to);
  const dur = Math.min(2.3, Math.max(1.25, 0.85 + route.len / 260));
  map.ship = { ...map.ship, id: toId, from: fromId, t: 0, route, dur };
  const p = getJourney();
  p.lastFlight = { from: fromId, to: toId }; // para poder repetirlo desde el mapa
  saveJourney();
}

/** La nave queda posada (sin viaje en curso). */
export function parkShip(id) {
  map.ship = { id, from: null, t: 1, route: null, dur: 1, ang: 0, angV: 0 };
}
