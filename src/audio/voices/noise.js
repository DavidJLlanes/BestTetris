import { audio } from '../context.js';
import { output } from './output.js';

/** Ráfaga de ruido filtrado (percusión, golpes, brillos). */
export function noise(bus, { t, dur, vol = 0.2, type = 'highpass', freq = 6000, q = 1, pan = 0 }) {
  const ctx = audio.ctx;
  const s = ctx.createBufferSource();
  s.buffer = audio.noise;
  const f = ctx.createBiquadFilter();
  f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(output(bus, pan));
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
}
