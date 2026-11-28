import { map } from '../mapState.js';
import { MAIN } from '../../catalog.js';
import { getJourney } from '../../progress/journeyStore.js';
import { parkShip, startTravel } from './startTravel.js';
import { aimAt } from '../camera.js';
import { playSfx } from '../../../audio/index.js';

/**
 * Vuelve a hacer el último vuelo de la nave (para verlo otra vez). Si aún no ha volado,
 * vuela desde la parada anterior del camino hasta la actual.
 */
export function replayFlight() {
  if (map.celebrate) return false;
  const p = getJourney();
  let f = p.lastFlight;
  if (!f || !map.byId[f.from] || !map.byId[f.to]) {
    const i = MAIN.findIndex((l) => l.id === map.ship.id);
    if (i <= 0) return false;
    f = { from: MAIN[i - 1].id, to: MAIN[i].id };
  }
  parkShip(f.from);
  map.cam.drag = false;
  aimAt(map.byId[f.from]);
  setTimeout(() => { startTravel(f.from, f.to); playSfx('jShip'); }, 450); // primero la cámara llega al despegue
  return true;
}
