import { $ } from '../../util/dom.js';
import { TYPES } from '../../config/shapes.js';
import { MAX_PIECES } from '../../puzzles/code/format.js';
import { editor, saveDraft } from './editorState.js';
import { cellColor } from './editorGrid.js';

const BRUSHES = ['G', ...TYPES];

/** Pincel (roca o color de pieza) y lista de piezas que recibirá el jugador. */
export function bindPalette(onChange) {
  const paint = $('ed-paint'), pieces = $('ed-pieces');
  paint.innerHTML = BRUSHES.map((b) => `<button class="ed-swatch" data-brush="${b}" style="--c:${cellColor(b)}" aria-label="Pincel ${b === 'G' ? 'roca' : b}">${b === 'G' ? '▦' : ''}</button>`).join('');
  pieces.innerHTML = TYPES.map((t) => `<button class="ed-piece" data-add="${t}" style="--c:${cellColor(t)}">${t}</button>`).join('') + '<button class="ed-piece" data-del aria-label="Quitar la última pieza">⌫</button>';
  const sync = () => paint.querySelectorAll('[data-brush]').forEach((b) => b.classList.toggle('on', b.dataset.brush === editor.brush));
  paint.addEventListener('click', (e) => { const b = e.target.closest('[data-brush]'); if (b) { editor.brush = b.dataset.brush; sync(); saveDraft(); } });
  pieces.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.add && editor.pieces.length < MAX_PIECES) editor.pieces += b.dataset.add;
    if (b.hasAttribute('data-del')) editor.pieces = editor.pieces.slice(0, -1);
    saveDraft(); onChange();
  });
  sync();
}

/** Las piezas elegidas, como fichas de color. */
export function renderSequence() {
  $('ed-seq').innerHTML = editor.pieces ? [...editor.pieces].map((t) => `<i style="--c:${cellColor(t)}">${t}</i>`).join('') : '<em>Añade al menos una pieza</em>';
}
