import { app } from './state.js';
import { stopMusic, startMusic } from '../audio/index.js';
import { showOverlay, hideOverlays } from '../ui/overlays.js';
import { countdown } from '../ui/countdown.js';
import { releaseAll } from '../input/state.js';
import { saveProfile } from '../storage/profile.js';

export function pause() {
  if (app.screen !== 'play' && app.screen !== 'countdown') return;
  app.screen = 'pause';
  if (app.game) app.game.softDrop = false;
  releaseAll();
  stopMusic();
  saveProfile();
  showOverlay('ov-pause');
}

export function resume() {
  if (app.screen !== 'pause' || app.device.phone && app.device.landscape) return;
  hideOverlays();
  countdown(() => { app.screen = 'play'; startMusic(); });
}

export function togglePause() {
  if (app.screen === 'play') pause();
  else if (app.screen === 'pause') resume();
}
