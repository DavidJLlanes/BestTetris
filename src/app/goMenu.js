import { app } from './state.js';
import { stopMusic } from '../audio/index.js';
import { showOverlay } from '../ui/overlays.js';
import { resetEffects } from '../effects/resetEffects.js';
import { emit } from './bus.js';

export function goMenu() {
  stopMusic();
  app.screen = 'menu';
  app.game = null;
  resetEffects();
  emit('menu', { game: null });
  showOverlay('ov-menu');
}
