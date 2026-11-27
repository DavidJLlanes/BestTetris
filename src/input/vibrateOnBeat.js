import { musicNow } from '../audio/index.js';
import { audio } from '../audio/context.js';
import { vibrate } from './haptics.js';

/**
 * Vibra encajado con la música: si la siguiente semicorchea llega pronto, espera a ella;
 * los patrones de varios golpes se espacian a ritmo de semicorcheas.
 */
export function vibrateOnBeat(pulses, wait = 0.09) {
  const h = audio.ctx && musicNow();
  if (!h) { vibrate(pulses.length === 1 ? pulses[0] : pulses.flatMap((p, i) => (i ? [40, p] : [p]))); return; }
  const gap = Math.round(h.sixteenth * 1000);
  const pattern = pulses.flatMap((p, i) => (i ? [Math.max(10, gap - pulses[i - 1]), p] : [p]));
  const delay = h.grid - audio.ctx.currentTime;
  const go = () => vibrate(pattern.length === 1 ? pattern[0] : pattern);
  if (delay > 0 && delay <= wait) setTimeout(go, delay * 1000); else go();
}
