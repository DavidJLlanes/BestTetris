import { $ } from '../../util/dom.js';
import { app } from '../../app/state.js';
import { showHint } from '../../tutorial/hint.js';
import { goalOf } from '../goals/list.js';

const FADE_MS = 3200;

/** Al empezar una constelación: la casilla del marcador cambia de nombre y el objetivo se anuncia arriba. */
export function levelHint(game) {
  const label = document.querySelector('.stat-lines span');
  const level = game.hooks.level;
  label.textContent = level ? game.hooks.progressLabel : 'Líneas';
  if (!level) return;
  const hint = $('hint');
  hint.classList.add('top');
  hint.classList.remove('faded');
  showHint(goalOf(level.spec.goal).text(level.spec.goal), level.sky.name);
  setTimeout(() => { if (app.game === game) hint.classList.add('faded'); }, FADE_MS);
}
