import { map } from '../map/mapState.js';
import { nodeStatus } from '../map/nodeStatus.js';
import { playSfx } from '../../audio/index.js';
import { openLevelCard } from './levelCard.js';
import { openShop } from './shopPanel.js';
import { mapToast } from './toast.js';

/** La cámara se acerca a la parada (zoom con perspectiva) y, al llegar, abre lo que haya allí. */
function zoomInto(n, done) {
  map.sel = n.id;
  map.cam.target = n.y;
  map.focusX = n.x;
  map.zoomTo = 1;
  map.zoomDone = done;
  playSfx('jWhoosh');
}

/** Tocar (o pulsar) una parada: ficha de la constelación o planeta tienda. */
export function tapNode(n) {
  if (map.celebrate) return;
  playSfx('ui');
  if (n.kind === 'shop') {
    if (nodeStatus(n).state === 'locked') { map.sel = n.id; mapToast(`Vence al jefe del tramo para aterrizar en ${n.planet.name}`); return; }
    zoomInto(n, () => openShop(n.tramo));
    return;
  }
  zoomInto(n, () => openLevelCard(n.level));
}
