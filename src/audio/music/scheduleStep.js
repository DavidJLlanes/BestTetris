import { audio } from '../context.js';
import { tone } from '../voices/tone.js';
import { noise } from '../voices/noise.js';
import { mtof } from '../voices/mtof.js';
import { MELODY, CHORDS, BASS, STEPS_PER_BAR, BARS } from './score.js';
import { TENSION_LAYERS } from './layers.js';

/** Programa una semicorchea de la canción en el instante t. */
export function scheduleStep(step, t, bpm, intensity, tension = 0, transpose = 0) {
  const bus = audio.music;
  const sixteenth = 60 / bpm / 4;
  const bar = Math.floor(step / STEPS_PER_BAR) % BARS;
  const inBar = step % STEPS_PER_BAR;
  const chord = CHORDS[bar].map((n) => n + transpose);

  const arp = [chord[0] + 12, chord[1] + 12, chord[2] + 12, chord[1] + 24];
  tone(bus, { freq: mtof(arp[inBar % 4]), type: 'triangle', t, dur: sixteenth * 0.9, vol: 0.05 + intensity * 0.02, r: 0.05, pan: (inBar % 4 - 1.5) * 0.25 });

  if (inBar === 0) {
    for (const n of chord) for (const detune of [-7, 7]) {
      tone(bus, { freq: mtof(n + 12), type: 'sawtooth', t, dur: sixteenth * 16, vol: 0.018, a: 0.3, r: 0.6, detune, cutoff: 900, pan: detune / 14 });
    }
  }

  if (inBar % 2 === 0) {
    const e = inBar / 2;
    if (BASS[e] !== null) tone(bus, { freq: mtof(chord[0] - 12 + BASS[e]), type: 'square', t, dur: sixteenth * 1.8, vol: 0.07, cutoff: 500, r: 0.06 });
    const line = MELODY[bar];
    if (line[e] !== null && intensity > 0.15) {
      let len = 1;
      while (e + len < 8 && line[e + len] === null) len++;
      const dur = sixteenth * 2 * len * 0.95;
      const note = line[e] + transpose;
      tone(bus, { freq: mtof(note), type: 'sawtooth', t, dur, vol: 0.05, a: 0.01, r: 0.12, cutoff: 2400, detune: -5 });
      tone(bus, { freq: mtof(note + 12), type: 'sine', t, dur, vol: 0.025, a: 0.01, r: 0.12 });
    }
  }

  if (inBar % 4 === 0) tone(bus, { freq: 140, glideTo: 40, type: 'sine', t, dur: 0.18, vol: 0.35, r: 0.1 });
  if (inBar === 4 || inBar === 12) noise(bus, { t, dur: 0.14, vol: 0.12, type: 'bandpass', freq: 1800, q: 0.8 });
  if (inBar % 2 === 1 && intensity > 0.3) noise(bus, { t, dur: 0.04, vol: 0.05, freq: 8000, pan: 0.3 });

  for (const layer of TENSION_LAYERS) layer({ bus, t, inBar, chord, sixteenth, tension });
}
