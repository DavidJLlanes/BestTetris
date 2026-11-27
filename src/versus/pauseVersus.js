import { app } from '../app/state.js';
import { playSfx, stopMusic, startMusic } from '../audio/index.js';
import { showOverlay, hideOverlays } from '../ui/overlays.js';
import { vs } from './state.js';

export function pauseVersus() {
  if (app.screen !== 'versus') return;
  app.screen = 'vpause';
  playSfx('ui');
  stopMusic();
  showOverlay('ov-vpause');
}

export function resumeVersus() {
  if (app.screen !== 'vpause') return;
  hideOverlays();
  vs.players.forEach((p) => { p.input.left = p.input.right = false; p.input.dir = 0; p.game.softDrop = false; });
  app.screen = 'versus';
  startMusic();
}
