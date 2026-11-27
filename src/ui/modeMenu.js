import { $ } from '../util/dom.js';
import { MODES } from '../modes/registry.js';
import { bestLabel } from '../storage/records.js';
import { onOpen } from './overlays.js';
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
    </button>`).join('');
  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-mode]');
    if (b) startGame(b.dataset.mode);
  });
  onOpen('ov-menu', () => {
    list.querySelector('[data-mode=tutorial]').classList.toggle('suggested', !load('tutorialDone', false));
    list.querySelectorAll('[data-best]').forEach((el) => {
      const best = bestLabel(el.dataset.best);
      el.textContent = best === '—' ? '' : `Récord: ${best}`;
    });
  });
}
