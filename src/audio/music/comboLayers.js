import { tone } from '../voices/tone.js';
import { noise } from '../voices/noise.js';
import { mtof } from '../voices/mtof.js';

/**
 * Capas que suma un combo: cuanto más largo, más rica la música, y se apagan solas.
 * combo 1: destellos en corcheas · 2: arpegio en semicorcheas · 3: pandereta · 4+: coro alto.
 */
export const COMBO_LAYERS = [
  ({ bus, t, inBar, chord, sixteenth, combo }) => {
    if (combo >= 1 && inBar % 2 === 0) tone(bus, { freq: mtof(chord[(inBar / 2) % 3] + 36), type: 'sine', t, dur: sixteenth * 1.6, vol: 0.022, r: 0.1, pan: (inBar % 4 ? 0.4 : -0.4) });
  },
  ({ bus, t, inBar, chord, sixteenth, combo }) => {
    if (combo >= 2 && inBar % 2 === 1) tone(bus, { freq: mtof(chord[(inBar + 1) % 3] + 24), type: 'triangle', t, dur: sixteenth * 0.8, vol: 0.026, pan: 0.25 });
  },
  ({ bus, t, inBar, combo }) => {
    if (combo >= 3 && inBar % 4 === 2) noise(bus, { t, dur: 0.06, vol: 0.05, type: 'highpass', freq: 7000, pan: -0.35 });
  },
  ({ bus, t, inBar, chord, sixteenth, combo }) => {
    if (combo >= 4 && inBar === 0) for (const n of chord) tone(bus, { freq: mtof(n + 24), type: 'sine', t, dur: sixteenth * 16, vol: 0.016, a: 0.25, r: 0.5, detune: 6 });
  },
];
