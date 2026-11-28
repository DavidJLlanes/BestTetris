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
  if (map.ship.from && map.ship.t < 1) return true; // ya está volando
  map.ship.alphaTo = 0; // se desvanece donde está…
  map.cam.drag = false;
  aimAt(map.byId[f.from]); // …mientras la cámara va con su muelle al punto de despegue
  setTimeout(() => { parkShip(f.from, 0); }, 260); // reaparece allí con un fundido
  setTimeout(() => { startTravel(f.from, f.to); playSfx('jShip'); }, 1100); // y despega cuando la cámara ya ha llegado
  return true;
}
