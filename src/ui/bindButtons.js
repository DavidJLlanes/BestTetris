import { $ } from '../util/dom.js';
import { app } from '../app/state.js';
import { initAudio, playSfx } from '../audio/index.js';
import { pushOverlay, backOverlay } from './overlays.js';
import { startGame } from '../app/startGame.js';
import { resume, togglePause } from '../app/pause.js';
import { goMenu } from '../app/goMenu.js';
import { toggleMute } from '../app/toggleMute.js';
import { bindFullscreenButton } from './install/fullscreenButton.js';

/** Botones fijos de la interfaz (los de modo los crea modeMenu). */
export function bindButtons() {
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => { initAudio(); playSfx('ui'); pushOverlay(b.dataset.open); }));
  document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => { playSfx('ui'); backOverlay(); }));
  $('btn-resume').addEventListener('click', resume);
  const again = () => startGame(app.modeDef || app.modeId);
  $('btn-restart').addEventListener('click', again);
  $('btn-again').addEventListener('click', again);
  $('btn-quit').addEventListener('click', goMenu);
  $('btn-menu').addEventListener('click', goMenu);
  $('btn-pause').addEventListener('click', () => { initAudio(); togglePause(); });
  $('btn-mute').addEventListener('click', () => { initAudio(); toggleMute(); });
  bindFullscreenButton();
  $('badge').addEventListener('click', () => { if (app.screen === 'menu') { playSfx('ui'); pushOverlay('ov-profile'); } });
}
