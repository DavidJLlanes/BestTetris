import { $ } from '../../util/dom.js';
import { onOpen, pushOverlay } from '../overlays.js';
import { decodePuzzle } from '../../puzzles/code/decodePuzzle.js';
import { goalText } from '../../puzzles/goals.js';
import { playPuzzle } from '../../puzzles/app/playPuzzle.js';

let found = null;

/** Muestra lo que trae un código. El nombre viene de otra persona: se pinta como texto, nunca como HTML. */
function preview(text) {
  const { puzzle, error } = text.trim() ? decodePuzzle(text) : { error: '' };
  found = puzzle || null;
  $('code-play').disabled = !found;
  const status = $('code-status');
  status.textContent = error || '';
  status.className = `status ${error ? 'error' : ''}`;
  const box = $('code-preview');
  box.replaceChildren();
  if (!found) return;
  for (const [k, v] of [['Puzle', found.name], ['Objetivo', goalText(found.goal)], ['Piezas', found.pieces.split('').join(' ')], ['Reserva', found.hold ? 'Sí' : 'No']]) {
    const a = document.createElement('span'); a.textContent = k;
    const b = document.createElement('b'); b.textContent = v;
    box.append(a, b);
  }
}

/** Jugar un puzle a partir de un código pegado o de un enlace ?puzzle=. */
export function bindCodePanel() {
  const input = $('code-input');
  onOpen('ov-puzzle-code', () => preview(input.value));
  input.addEventListener('input', () => preview(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && found) playPuzzle(found); });
  $('code-play').addEventListener('click', () => { if (found) playPuzzle(found); });
}

/** Si la página se abrió con ?puzzle=..., lo enseña listo para jugar y limpia la URL. */
export function openSharedPuzzle() {
  const code = new URLSearchParams(location.search).get('puzzle');
  if (!code) return;
  $('code-input').value = code;
  history.replaceState(null, '', location.pathname);
  pushOverlay('ov-puzzle-code');
}
