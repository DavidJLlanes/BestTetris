import { app } from '../app/state.js';
import { playSfx, stopMusic } from '../audio/index.js';
import { showOverlay } from '../ui/overlays.js';
import { $ } from '../util/dom.js';
import { VS_NAMES } from '../config/versus.js';
import { vs } from './state.js';

const SHOW_DELAY_MS = 1100;

/** Fin de la ronda: un tablero se llenó y gana el otro. */
export function endRound(winner) {
  if (app.screen !== 'versus') return;
  app.screen = 'vover';
  vs.winner = winner;
  vs.wins[winner]++;
  stopMusic();
  playSfx('win');
  $('vover-title').textContent = `¡Gana ${VS_NAMES[winner]}!`;
  $('vover-title').style.color = winner ? 'var(--accent)' : 'var(--accent2)';
  $('vover-score').innerHTML = vs.players.map((p, i) => `<span>${VS_NAMES[i]}</span><b>${vs.wins[i]} ${vs.wins[i] === 1 ? 'ronda' : 'rondas'} · ${p.game.lines} líneas · ${p.sent} enviadas</b>`).join('');
  setTimeout(() => { if (app.screen === 'vover') showOverlay('ov-vover'); }, SHOW_DELAY_MS);
}
