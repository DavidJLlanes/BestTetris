import { app } from '../app/state.js';
import { $ } from '../util/dom.js';
import { initAudio, playSfx, restartMusic, startMusic, setMusicLevel, setMusicTranspose } from '../audio/index.js';
import { hideOverlays } from '../ui/overlays.js';
import { spawn } from '../core/game/index.js';
import { vs } from './state.js';
import { createPlayer } from './createPlayer.js';
import { onPlayerEvent } from './onPlayerEvent.js';
import { screenUi } from './screen/screenUi.js';

const STEP_MS = 600;

/** Cuenta atrás compartida y salida a la vez de los dos tableros. */
function countdown(done) {
  const el = $('vs-count');
  let n = 3;
  const step = () => {
    if (app.screen !== 'vcount') { el.hidden = true; return; }
    if (!n) { el.hidden = true; playSfx('count', { high: true }); done(); return; }
    el.hidden = false; el.textContent = n--;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
    playSfx('count');
    setTimeout(step, STEP_MS);
  };
  step();
}

/** Empieza una ronda a dos: mismas piezas para los dos, nueva semilla en cada ronda. */
export function startVersus({ newSeries = false } = {}) {
  initAudio();
  if (newSeries) vs.wins = [0, 0];
  const seed = (Math.random() * 2 ** 32) >>> 0;
  vs.players = [0, 1].map((i) => createPlayer(i, seed, onPlayerEvent));
  vs.winner = -1;
  app.game = null;
  hideOverlays();
  document.body.classList.add('versus-on');
  $('versus').hidden = false;
  screenUi();
  setMusicLevel(1); setMusicTranspose(0); restartMusic();
  app.screen = 'vcount';
  countdown(() => { app.screen = 'versus'; vs.players.forEach((p) => spawn(p.game)); startMusic(); });
}

/** Sale del modo a dos y vuelve al menú. */
export function leaveVersus(goMenu) {
  vs.players = [];
  document.body.classList.remove('versus-on');
  $('versus').hidden = true;
  goMenu();
}
