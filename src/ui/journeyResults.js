import { $ } from '../util/dom.js';
import { formatTime } from '../util/formatTime.js';
import { formatNumber } from '../util/formatNumber.js';
import { SCENES } from '../scenes/sceneList.js';
import { summarizeTrail } from '../scenes/sceneTrail.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Recorrido animado en el resumen: una línea de luz que baja por las escenas vividas, cada una
 * con sus colores, sus líneas, sus puntos y su tiempo. Aparecen una tras otra al abrirse el panel.
 */
export function renderJourney(g) {
  const box = $('over-journey');
  const rows = summarizeTrail(g);
  box.hidden = !rows.length;
  if (!rows.length) return;
  const journey = g.hooks.sceneDrive === 'journey';
  const maxLines = Math.max(1, ...rows.map((r) => r.lines));
  const head = journey
    ? `<h3>Tu viaje <small>${rows.length} de ${SCENES.length} escenas</small></h3>`
    : `<h3>Recorrido <small>${rows.length} ${rows.length === 1 ? 'escena' : 'escenas'}</small></h3>`;
  box.innerHTML = head + '<ol>' + rows.map((r, i) => {
    const [c1, c2, c3] = r.scene.colors;
    return `<li style="--i:${i};--c1:${c1};--c2:${c2};--c3:${c3};--tint:${r.scene.tint};--share:${(r.lines / maxLines).toFixed(3)}">
      <i class="dot"></i>
      <div class="jr-body">
        <b>${esc(r.scene.name)}</b>
        <span>${r.lines} ${r.lines === 1 ? 'línea' : 'líneas'} · ${formatNumber(r.score)} pts · ${formatTime(r.time)}</span>
        <em class="bar"></em>
      </div>
    </li>`;
  }).join('') + '</ol>';
}
