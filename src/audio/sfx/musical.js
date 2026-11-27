import { tone } from '../voices/tone.js';
import { noise } from '../voices/noise.js';
import { mtof } from '../voices/mtof.js';

/**
 * Efectos musicales: cada jugada es una nota de la canción. Reciben (bus, t, opciones, h) con
 * h = musicNow(): acorde y escalera de notas que suenan ahora. Nada desafina nunca.
 *  - mover: pulsación cristalina cuya altura sigue a la columna de la pieza
 *  - girar: campanita una tercera por encima
 *  - bajar: latido grave y suave
 *  - soltar: bombo con la fundamental del acorde
 *  - líneas: el acorde entero (más notas cuantas más líneas) y un brillo que sube
 *  - combo: arpegio que sube un peldaño por cada combo
 */
const col = (x = 4) => Math.max(0, Math.min(9, Math.round(x)));
/** Nota i de la escalera, sin salirse de ella. */
export const pick = (h, i) => h.ladder[Math.max(0, Math.min(h.ladder.length - 1, i))];

export const MUSICAL = {
  move: (bus, t, { pan, x }, h) => tone(bus, { freq: mtof(pick(h, 2 + col(x))), type: 'triangle', t, dur: 0.09, vol: 0.05, r: 0.07, pan }),
  rotate: (bus, t, { pan, x, rot = 0 }, h) => {
    const n = pick(h, 5 + ((col(x) + rot) % 6));
    tone(bus, { freq: mtof(n), type: 'sine', t, dur: 0.22, vol: 0.06, r: 0.18, pan });
    tone(bus, { freq: mtof(n + 12), type: 'sine', t, dur: 0.12, vol: 0.02, pan });
  },
  softDrop: (bus, t, { pan }, h) => tone(bus, { freq: mtof(h.chord[0] - 12), type: 'sine', t, dur: 0.05, vol: 0.05, pan }),
  lock: (bus, t, { pan }, h) => {
    tone(bus, { freq: mtof(h.chord[0]), type: 'triangle', t, dur: 0.16, vol: 0.08, r: 0.12, pan });
    tone(bus, { freq: mtof(h.chord[2]), type: 'sine', t: t + 0.01, dur: 0.14, vol: 0.04, pan });
  },
  hardDrop: (bus, t, { pan, distance = 10 }, h) => {
    const k = Math.min(1, 0.45 + distance / 20);
    tone(bus, { freq: 150, glideTo: 42, type: 'sine', t, dur: 0.2, vol: 0.4 * k, pan });
    tone(bus, { freq: mtof(h.chord[0] - 12), type: 'triangle', t, dur: 0.3, vol: 0.12 * k, r: 0.2, cutoff: 900, pan });
    noise(bus, { t, dur: 0.08, vol: 0.06 * k, type: 'lowpass', freq: 1800, pan });
  },
  hold: (bus, t, opts, h) => tone(bus, { freq: mtof(h.chord[1] + 12), glideTo: mtof(h.chord[2] + 12), type: 'sine', t, dur: 0.14, vol: 0.08 }),
  clear: (bus, t, { lines = 1 }, h) => {
    const voices = lines >= 4 ? [...h.chord.map((n) => n + 12), h.chord[0] + 24, h.chord[1] + 24] : h.chord.slice(0, Math.min(3, lines + 1)).map((n) => n + 12);
    voices.forEach((n, i) => {
      tone(bus, { freq: mtof(n), type: 'sawtooth', t, dur: 0.7, vol: 0.05, a: 0.01, r: 0.5, cutoff: 2600, detune: i % 2 ? 6 : -6, pan: (i / voices.length - 0.5) * 0.9 });
      tone(bus, { freq: mtof(n + 12), type: 'sine', t: t + 0.06 * i, dur: 0.5, vol: 0.04, r: 0.35 });
    });
    noise(bus, { t, dur: 0.4 + lines * 0.1, vol: 0.05 + lines * 0.02, type: 'highpass', freq: 3500 });
  },
  combo: (bus, t, { combo = 1 }, h) => {
    const steps = Math.min(combo + 2, 8);
    for (let i = 0; i < steps; i++) tone(bus, { freq: mtof(pick(h, 3 + Math.min(combo, 2) + i)), type: 'triangle', t: t + 0.12 + i * h.sixteenth * 0.5, dur: 0.14, vol: 0.045, pan: (i / steps - 0.5) * 0.8 });
  },
};

/** Jugadas que esperan a la siguiente semicorchea (si llega pronto) para caer a tiempo. */
export const QUANTIZE = { move: 0.03, rotate: 0.04, softDrop: 0.03, lock: 0.05, hardDrop: 0.035, hold: 0.05, clear: 0.12, combo: 0.12 };
