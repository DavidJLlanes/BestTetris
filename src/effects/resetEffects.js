import { fx } from './state.js';

export function resetEffects() {
  fx.particles = []; fx.texts = []; fx.trails = []; fx.rowOffsets = [];
  fx.lockFlash = null; fx.levelFlash = 0; fx.shake = 0;
  fx.bounce.x = 0; fx.bounce.v = 0;
  fx.zoom.x = 0; fx.zoom.v = 0;
  fx.slow = null; fx.overT = 0;
}
