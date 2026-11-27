import { $ } from '../../util/dom.js';
import { onOpen } from '../overlays.js';
import { playSfx } from '../../audio/index.js';
import { editor, saveDraft, resetDraft } from './editorState.js';
import { bindGrid, renderGrid } from './editorGrid.js';
import { bindPalette, renderSequence } from './editorPalette.js';
import { buildEditorPuzzle } from './buildEditorPuzzle.js';
import { copyText, shareLink, puzzleUrl } from './shareCode.js';
import { validatePuzzle } from '../../puzzles/code/validatePuzzle.js';
import { encodePuzzle } from '../../puzzles/code/encodePuzzle.js';
import { checkInWorker } from '../../puzzles/solver/checkInWorker.js';
import { playPuzzle } from '../../puzzles/app/playPuzzle.js';

const VERDICT = {
  yes: ['ok', '✓ Tiene solución. ¡Listo para compartir!'],
  no: ['error', 'No encuentro solución sin usar la reserva. Revisa las piezas o el objetivo.'],
  unknown: ['', 'Es demasiado grande para comprobarlo aquí. Pruébalo tú.'],
};

function status(text, kind = '') { const el = $('ed-status'); el.textContent = text; el.className = `status ${kind}`; }

/** Puzle actual o null (con el motivo en el estado). */
function current() {
  const p = buildEditorPuzzle();
  const error = validatePuzzle(p);
  if (error) { status(error, 'error'); playSfx('miss'); return null; }
  return p;
}

/** Editor de puzles: pinta, elige piezas y objetivo, comprueba, prueba y comparte. */
export function bindEditorPanel() {
  const grid = $('ed-grid'), name = $('ed-name'), goal = $('ed-goal'), n = $('ed-n'), hold = $('ed-hold');
  const changed = () => { renderSequence(); $('ed-n-wrap').hidden = editor.goal === 'perfect'; status(''); };
  bindGrid(grid, changed);
  bindPalette(changed);
  const fill = () => { name.value = editor.name; goal.value = editor.goal; n.value = editor.n; hold.checked = editor.hold; renderGrid(grid); changed(); };
  onOpen('ov-editor', fill);
  name.addEventListener('input', () => { editor.name = name.value; saveDraft(); });
  goal.addEventListener('change', () => { editor.goal = goal.value; saveDraft(); changed(); });
  n.addEventListener('input', () => { editor.n = n.value; saveDraft(); });
  hold.addEventListener('input', () => { editor.hold = hold.checked; saveDraft(); });
  $('ed-clear').addEventListener('click', () => { resetDraft(); fill(); });
  $('ed-play').addEventListener('click', () => { const p = current(); if (p) playPuzzle(p); });
  $('ed-check').addEventListener('click', async () => {
    const p = current();
    if (!p) return;
    status('Buscando una solución…');
    const [kind, text] = VERDICT[await checkInWorker(p)];
    status(text, kind);
    playSfx(kind === 'ok' ? 'levelUp' : 'ui');
  });
  $('ed-copy').addEventListener('click', async () => { const p = current(); if (p) { const code = encodePuzzle(p); status((await copyText(code)) || code, 'ok'); } });
  $('ed-share').addEventListener('click', async () => { const p = current(); if (p) { const msg = await shareLink(puzzleUrl(encodePuzzle(p)), p.name); if (msg) status(msg, 'ok'); } });
}
