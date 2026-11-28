import { $ } from '../../util/dom.js';
import { map } from '../map/mapState.js';
import { aimAt } from '../map/camera.js';
import { nodeStatus } from '../map/nodeStatus.js';

const label = (n) => {
  const st = nodeStatus(n);
  if (n.kind === 'shop') return `${n.planet.name}, planeta tienda${st.state === 'locked' ? ' (cerrado)' : ''}`;
  const name = n.kind === 'hidden' && st.state === 'locked' ? 'Constelación oculta' : n.level.sky.name;
  return `${name}${st.state === 'locked' ? ', cerrada' : st.stars ? `, ${st.stars} de 3 estrellas` : ', abierta'}`;
};

/**
 * Un botón invisible por parada, de arriba abajo: el mando y el teclado se mueven por ellos
 * (arriba = la siguiente constelación) y al enfocar uno el mapa la centra.
 */
export function buildNodeButtons(onPick) {
  const box = $('jm-nodes');
  const list = [...map.nodes].sort((a, b) => b.y - a.y);
  box.innerHTML = list.map((n) => `<button type="button" data-node="${n.id}"></button>`).join('');
  box.addEventListener('focusin', (e) => {
    const b = e.target.closest('[data-node]');
    if (!b) return;
    map.sel = b.dataset.node;
    aimAt(map.byId[b.dataset.node]);
  });
  box.addEventListener('click', (e) => { const b = e.target.closest('[data-node]'); if (b) onPick(map.byId[b.dataset.node]); });
}

/** Pone al día los nombres (para lectores de pantalla) y marca la parada que debe recibir el foco. */
export function refreshNodeButtons(focusId) {
  document.querySelectorAll('#jm-nodes [data-node]').forEach((b) => {
    const n = map.byId[b.dataset.node];
    b.setAttribute('aria-label', label(n));
    b.toggleAttribute('autofocus', n.id === focusId);
  });
}

/** Flechas arriba y abajo (o W y S) pasan a la parada vecina. */
export function bindNodeKeys() {
  addEventListener('keydown', (e) => {
    if ($('ov-journey').hidden || !document.activeElement || !document.activeElement.closest('#jm-nodes')) return;
    const d = { ArrowUp: -1, KeyW: -1, ArrowDown: 1, KeyS: 1 }[e.code];
    if (!d) return;
    e.preventDefault();
    const sib = d < 0 ? document.activeElement.previousElementSibling : document.activeElement.nextElementSibling;
    if (sib) sib.focus({ preventScroll: true });
  });
}
