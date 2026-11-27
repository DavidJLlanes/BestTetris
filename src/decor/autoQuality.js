import { app } from '../app/state.js';
import { perf } from '../app/perf.js';
import { decor } from './state.js';
import { applyDecor } from './applyDecor.js';

const CHECK_MS = 3000;
const STEP_DOWN = { high: 'medium', medium: 'low' };

/** Calidad automática: si el juego no llega a ~50 fotogramas por segundo, baja un escalón. */
export function watchAutoQuality() {
  setInterval(() => {
    if (app.settings.quality !== 'auto' || document.hidden || app.screen !== 'play') return;
    const { fps } = perf.stats();
    const next = STEP_DOWN[decor.quality];
    if (fps && fps < 50 && next) { decor.autoQuality = next; applyDecor(app.settings); }
  }, CHECK_MS);
}
