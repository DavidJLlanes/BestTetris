import { on } from '../app/bus.js';
import { replayState } from '../replay/watchReplay.js';
import { raceDelta } from '../replay/raceDelta.js';
import { formatNumber } from '../util/formatNumber.js';
import { setBest } from './hud.js';

function text(d) {
  if (d.kind === 'score') return `${d.value >= 0 ? '+' : '−'}${formatNumber(Math.abs(d.value))}`;
  if (d.value === -Infinity) return '¡Por delante!';
  return `${d.value <= 0 ? '−' : '+'}${Math.abs(d.value).toFixed(1)} s`;
}

/** Durante una carrera contra tu mejor intento, la casilla de récord muestra la diferencia. */
export function bindRaceHud() {
  const box = document.querySelector('.stat-best'), label = box.querySelector('span');
  const reset = () => { label.textContent = 'Récord'; box.classList.remove('ahead', 'behind', 'race'); document.body.classList.remove('race-time', 'race-score'); };
  on('gameStart', ({ game }) => {
    reset();
    if (!replayState.ghost) return;
    box.classList.add('race');
    label.textContent = 'Fantasma';
    setBest('—');
    document.body.classList.add(game.hooks.record === 'score' ? 'race-score' : 'race-time');
  });
  on('spawn', ({ game }) => {
    const ghost = replayState.ghost;
    if (!ghost || game.hooks.spectate) return;
    const d = raceDelta(game, ghost);
    if (!d) return;
    setBest(text(d));
    const ahead = d.kind === 'score' ? d.value >= 0 : d.value <= 0;
    box.classList.toggle('ahead', ahead);
    box.classList.toggle('behind', !ahead);
  });
  on('menu', reset);
}
