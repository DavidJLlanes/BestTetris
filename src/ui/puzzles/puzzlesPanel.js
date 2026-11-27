import { $ } from '../../util/dom.js';
import { onOpen } from '../overlays.js';
import { PUZZLE_SETS, ALL_PUZZLES, getPuzzle } from '../../puzzles/registry.js';
import { getProfile } from '../../storage/profile.js';
import { formatTime } from '../../util/formatTime.js';
import { playPuzzle } from '../../puzzles/app/playPuzzle.js';

function tile(p, i, solved) {
  const t = solved[p.id];
  return `<button class="puzzle-tile ${t !== undefined ? 'solved' : ''}" data-puzzle="${p.id}">
    <span class="puzzle-num">${t !== undefined ? '✓' : i + 1}</span>
    <span class="puzzle-name">${p.name}</span>
    <small>${t !== undefined ? formatTime(t, true) : ''}</small>
  </button>`;
}

/** Colecciones de puzles con lo ya resuelto. Los nombres son del juego (no del jugador). */
export function bindPuzzlesPanel() {
  const list = $('puzzle-sets');
  onOpen('ov-puzzles', () => {
    const solved = getProfile().puzzles;
    const count = ALL_PUZZLES.filter((p) => solved[p.id] !== undefined).length;
    $('puzzle-summary').innerHTML = `<b>${count}</b> de ${ALL_PUZZLES.length} resueltos<div class="bar"><i style="transform:scaleX(${count / ALL_PUZZLES.length})"></i></div>`;
    list.innerHTML = PUZZLE_SETS.map((s) => `<h4>${s.name}</h4><div class="puzzle-grid">${s.puzzles.map((p, i) => tile(p, i, solved)).join('')}</div>`).join('');
  });
  list.addEventListener('click', (e) => { const b = e.target.closest('[data-puzzle]'); if (b) playPuzzle(getPuzzle(b.dataset.puzzle)); });
}
