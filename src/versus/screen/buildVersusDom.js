import { $ } from '../../util/dom.js';
import { VS_NAMES, VS_COLORS } from '../../config/versus.js';

const column = (i) => `
  <section class="vs-player" style="--pc:${VS_COLORS[i]}">
    <header class="vs-head"><b>${VS_NAMES[i]}</b><span class="vs-wins" data-wins></span></header>
    <div class="vs-row">
      <div class="vs-side"><small>Reserva</small><canvas data-hold></canvas><small>Líneas</small><b data-lines>0</b><small>Enviadas</small><b data-sent>0</b></div>
      <canvas class="vs-board" data-board></canvas>
      <div class="vs-side"><small>Siguientes</small><canvas data-next></canvas></div>
    </div>
  </section>`;

/** Crea (una vez) las dos columnas de juego y devuelve sus lienzos y marcadores. */
export function buildVersusDom() {
  const root = $('versus');
  if (!root.dataset.built) {
    root.innerHTML = `${column(0)}<div class="vs-count" id="vs-count" hidden></div>${column(1)}`;
    root.dataset.built = '1';
  }
  return [...root.querySelectorAll('.vs-player')].map((el) => {
    const q = (k) => el.querySelector(`[data-${k}]`);
    return {
      board: q('board').getContext('2d'), hold: q('hold').getContext('2d'), next: q('next').getContext('2d'),
      lines: q('lines'), sent: q('sent'), wins: q('wins'), last: {},
    };
  });
}
