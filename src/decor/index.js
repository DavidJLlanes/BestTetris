import { bindParallax } from './parallax.js';
import { decorReactions } from './decorReactions.js';
import { watchAutoQuality } from './autoQuality.js';
import { resetDust } from './dustLayer.js';
export { updateDecor } from './decorLoop.js';

/** Pone en marcha la decoración: reacciones a la partida, profundidad y calidad automática. */
export function initDecor() {
  bindParallax();
  decorReactions();
  watchAutoQuality();
  let t = 0;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(resetDust, 200); });
}
