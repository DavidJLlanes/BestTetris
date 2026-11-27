import { $ } from '../util/dom.js';
import { MODES } from '../modes/registry.js';
import { bestLabel } from '../storage/records.js';
import { onOpen, pushOverlay } from './overlays.js';
import { playSfx } from '../audio/index.js';
import { getProfile } from '../storage/profile.js';
import { ALL_PUZZLES } from '../puzzles/registry.js';
import { startGame } from '../app/startGame.js';
import { load } from '../storage/store.js';
import { modeCardHtml } from './modeCards/modeCardHtml.js';
import { bindCardTilt } from './modeCards/bindCardTilt.js';
import { launchCard } from './modeCards/launchCard.js';

const FEATURED = 'journey'; // el modo destacado del menú
const BADGE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18.5h16M4.5 16 3 7l5 4 4-7 4 7 5-4-1.5 9z" fill="currentColor"/></svg>';

/** Genera las tarjetas de modo a partir del registro: un modo nuevo aparece solo. */
export function bindModeMenu() {
  const list = $('mode-list');
  const first = MODES.filter((m) => m.id === 'tutorial' || m.id === FEATURED).sort((a) => (a.id === 'tutorial' ? -1 : 1));
  const ordered = [...first, ...MODES.filter((m) => !first.includes(m))];
  list.innerHTML = ordered.map((m, i) => modeCardHtml({ ...m, featured: m.id === FEATURED, ribbon: m.id === FEATURED ? 'Recomendado' : '' }, i)).join('')
    + modeCardHtml({ id: 'puzzles', name: 'Puzles', description: 'Retos con solución, entrenador y editor', attrs: 'data-open-puzzles', best: 'id="puzzle-count"' }, ordered.length);
  bindCardTilt(list);
  list.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-mode]'); // body también lleva data-mode
    if (b) launchCard(b, () => startGame(b.dataset.mode));
    const pz = e.target.closest('[data-open-puzzles]');
    if (pz) launchCard(pz, () => { playSfx('ui'); pushOverlay('ov-puzzles'); });
  });
  onOpen('ov-menu', () => {
    const solved = getProfile().puzzles;
    const n = ALL_PUZZLES.filter((p) => solved[p.id] !== undefined).length;
    $('puzzle-count').innerHTML = n ? `${BADGE}${n}/${ALL_PUZZLES.length}` : '';
    const tut = list.querySelector('[data-mode=tutorial]');
    const suggest = !load('tutorialDone', false);
    tut.classList.toggle('suggested', suggest);
    tut.classList.toggle('wide', suggest);
    list.querySelectorAll('[data-best]').forEach((el) => {
      const best = bestLabel(el.dataset.best);
      el.innerHTML = best === '—' ? '' : `${BADGE}${best}`;
    });
  });
}
