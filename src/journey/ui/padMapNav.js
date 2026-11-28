import { $ } from '../../util/dom.js';
import { map } from '../map/mapState.js';
import { project } from '../map/project.js';
import { navItems } from '../../ui/nav/navItems.js';
import { spatialNext } from '../../ui/nav/spatialNext.js';
import { padFocus } from '../../ui/nav/padFocus.js';

const P = {};
const nodeButton = (id) => document.querySelector(`#jm-nodes [data-node="${id}"]`);

/** Un «elemento» con la posición en pantalla de la parada elegida, para buscar vecinos desde ella. */
function nodeRect(id) {
  const n = map.byId[id];
  const c = $('jm-canvas').getBoundingClientRect();
  project(n.x, n.y, P);
  const r = n.r * P.s;
  const x = c.left + P.x, y = c.top + P.y;
  return { getBoundingClientRect: () => ({ left: x - r, right: x + r, top: y - r, bottom: y + r, width: 2 * r, height: 2 * r }) };
}

/**
 * Mando y flechas en el mapa: arriba y abajo recorren las paradas (la cámara las sigue); a los
 * lados se salta a los botones del mapa, y desde ellos se vuelve a la parada si es lo más cercano
 * en esa dirección.
 */
export function padMapNav(dir) {
  const a = document.activeElement;
  const box = $('jm-nodes');
  const hud = navItems($('ov-journey'));
  if (a && box.contains(a)) {
    if (dir === 'up' || dir === 'down') {
      const sib = dir === 'up' ? a.previousElementSibling : a.nextElementSibling;
      if (sib) padFocus(sib);
      return true;
    }
    const next = spatialNext(nodeRect(a.dataset.node), hud, dir);
    if (next) padFocus(next);
    return true;
  }
  if (a && hud.includes(a)) {
    // la parada elegida compite con los botones: se va a lo que esté más cerca en esa dirección
    const node = nodeRect(map.sel);
    const next = spatialNext(a, [...hud, node], dir);
    padFocus(!next || next === node ? nodeButton(map.sel) || box.firstElementChild : next);
    return true;
  }
  padFocus(nodeButton(map.sel) || box.firstElementChild);
  return true;
}
