import { $ } from '../util/dom.js';
import { MODES } from '../modes/registry.js';
import { bestLabel } from '../storage/records.js';
import { onOpen, pushOverlay } from './overlays.js';
import { playSfx } from '../audio/index.js';
import { getProfile } from '../storage/profile.js';
import { ALL_PUZZLES } from '../puzzles/registry.js';
import { startGame } from '../app/startGame.js';
import { load } from '../storage/store.js';

/** Genera los botones de modo a partir del registro: un modo nuevo aparece solo. */
export function bindModeMenu() {
  const list = $('mode-list');
  list.innerHTML = MODES.map((m) => `
    <button class="mode" data-mode="${m.id}">
      <span class="mode-icon">${m.icon}</span>
      <span class="mode-name">${m.name}</span>
      <small class="mode-desc">${m.description}</small>
      <small class="mode-best" data-best="${m.id}"></small>
    </button>`).join('') + `
    <button class="mode" data-open-puzzles>
      <span class="mode-icon">🧩</span>
      <span class="mode-name">Puzles</span>
      <small class="mode-desc">Retos con solución, entrenador y editor</small>
      <small class="mode-best" id="puzzle-count"></small>
    </button>`;
  list.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-mode]'); // body también lleva data-mode
    if (b) startGame(b.dataset.mode);
    if (e.target.closest('[data-open-puzzles]')) { playSfx('ui'); pushOverlay('ov-puzzles'); }
  });
  onOpen('ov-menu', () => {
    const solved = getProfile().puzzles;
    const n = ALL_PUZZLES.filter((p) => solved[p.id] !== undefined).length;
    $('puzzle-count').textContent = n ? `${n}/${ALL_PUZZLES.length} resueltos` : '';
    list.querySelector('[data-mode=tutorial]').classList.toggle('suggested', !load('tutorialDone', false));
    list.querySelectorAll('[data-best]').forEach((el) => {
      const best = bestLabel(el.dataset.best);
      el.textContent = best === '—' ? '' : `Récord: ${best}`;
    });
  });
}
