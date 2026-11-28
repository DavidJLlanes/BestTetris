import { $ } from '../../util/dom.js';
import { map } from '../map/mapState.js';
import { aimAt } from '../map/camera.js';
import { runMap } from '../map/mapLoop.js';
import { resizeMap } from '../map/resizeMap.js';
import { startCelebration, litIndex } from '../map/celebrate.js';
import { pushOverlay, topOverlay } from '../../ui/overlays.js';
import { getJourney } from '../progress/journeyStore.js';
import { frontier } from '../progress/unlocks.js';
import { renderMapHud } from './mapHud.js';
import { refreshNodeButtons } from './nodeButtons.js';
import { playSfx } from '../../audio/index.js';
import { mapToast } from './toast.js';

/**
 * Abre el mapa. Sin nada: entra volando desde arriba hasta tu parada. Con { result } (al volver
 * de ganar): celebra la constelación y lleva la nave a la siguiente.
 */
export function openJourney({ result = null } = {}) {
  const p = getJourney();
  const front = frontier(p);
  const here = result ? result.level.id : p.at && map.byId[p.at] ? p.at : front.id;
  map.parts.length = 0;
  map.zoom = map.zoomTo = 0; map.zoomDone = null; map.focusX = 0;
  map.sel = here;
  map.ship = { id: here, from: null, t: 1 };
  const node = map.byId[here];
  map.cam.v = 0;
  if (result && result.won) {
    const next = front.id !== here && !result.prev ? front.id : null;
    map.lit = result.level.kind === 'main' || result.level.kind === 'boss' ? litIndex(here) : litIndex(front.id);
    map.cam.y = node.y;
    startCelebration(result, next, litIndex(front.id));
  } else {
    map.lit = litIndex(front.id);
    map.cam.y = result ? node.y : node.y + 900; // la primera vez, la cámara baja desde lejos hasta tu parada
    aimAt(node);
    if (!result) playSfx('jWhoosh');
  }
  (result && result.notes || []).forEach((t, i) => setTimeout(() => mapToast(t), 4200 + i * 2800));
  refreshNodeButtons(map.celebrate && map.celebrate.next ? map.celebrate.next : here);
  if (topOverlay() !== $('ov-journey')) pushOverlay('ov-journey');
  resizeMap();
  renderMapHud();
  runMap();
}
