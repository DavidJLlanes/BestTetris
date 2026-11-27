import { audio } from '../context.js';
import { output } from './output.js';

/** Oscilador con envolvente, filtro, glissando y panorama opcionales. */
export function tone(bus, { freq, type = 'sine', t, dur, vol = 0.2, a = 0.005, r = 0.08, detune = 0, cutoff = 0, glideTo = 0, pan = 0 }) {
  const ctx = audio.ctx;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  o.detune.value = detune;
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + a);
  g.gain.setValueAtTime(vol, t + Math.max(a, dur - r));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o;
  if (cutoff) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = cutoff; f.Q.value = 2;
    o.connect(f); node = f;
  }
  node.connect(g);
  g.connect(output(bus, pan));
  o.start(t);
  o.stop(t + dur + 0.02);
}
