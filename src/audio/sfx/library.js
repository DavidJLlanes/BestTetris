import { tone } from '../voices/tone.js';
import { noise } from '../voices/noise.js';
import { mtof } from '../voices/mtof.js';
import { JOURNEY_SFX } from './journeySfx.js';

/**
 * Efectos de sonido. Cada uno recibe (bus, t, opciones) donde opciones puede llevar
 * pan (posición de la pieza, -1..1) y datos propios del evento.
 */
const vary = (f, amount = 0.03) => f * (1 + (Math.random() - 0.5) * amount);

export const SFX = {
  move: (bus, t, { pan }) => tone(bus, { freq: vary(520), type: 'triangle', t, dur: 0.03, vol: 0.06, pan }),
  rotate: (bus, t, { pan }) => tone(bus, { freq: vary(760), glideTo: 980, type: 'triangle', t, dur: 0.05, vol: 0.07, pan }),
  softDrop: (bus, t, { pan }) => tone(bus, { freq: vary(300, 0.08), type: 'triangle', t, dur: 0.02, vol: 0.025, pan }),
  lock: (bus, t, { pan }) => {
    tone(bus, { freq: 220, glideTo: 120, type: 'sine', t, dur: 0.09, vol: 0.18, pan });
    noise(bus, { t, dur: 0.05, vol: 0.05, type: 'lowpass', freq: 1500, pan });
  },
  hardDrop: (bus, t, { pan, distance = 10 }) => {
    const k = Math.min(1, 0.4 + distance / 20);
    tone(bus, { freq: 180, glideTo: 45, type: 'sine', t, dur: 0.18, vol: 0.38 * k, pan });
    noise(bus, { t, dur: 0.12, vol: 0.13 * k, type: 'lowpass', freq: 2200, pan });
    noise(bus, { t: t + 0.005, dur: 0.05, vol: 0.05 * k, type: 'highpass', freq: 5000, pan });
  },
  hold: (bus, t) => tone(bus, { freq: 440, glideTo: 660, type: 'sine', t, dur: 0.1, vol: 0.1 }),
  clear: (bus, t, { lines = 1 }) => {
    const base = [0, 72, 76, 79, 84][lines] || 72;
    const notes = lines >= 4 ? [0, 4, 7, 12, 16] : [0, 4, 7].slice(0, lines + 1);
    notes.forEach((iv, i) => tone(bus, { freq: mtof(base + iv), type: 'triangle', t: t + i * 0.045, dur: 0.35, vol: 0.12, r: 0.25, pan: (i / notes.length - 0.5) * 0.8 }));
    noise(bus, { t, dur: 0.3 + lines * 0.08, vol: 0.06 + lines * 0.02, type: 'highpass', freq: 3000 });
  },
  tspin: (bus, t) => [79, 83, 86, 91].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'sine', t: t + i * 0.035, dur: 0.25, vol: 0.09 })),
  combo: (bus, t, { combo = 1 }) => tone(bus, { freq: mtof(72 + Math.min(combo, 12) * 2), type: 'square', t: t + 0.12, dur: 0.12, vol: 0.05, cutoff: 3000 }),
  levelUp: (bus, t) => [72, 76, 79, 84, 88].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'square', t: t + i * 0.07, dur: 0.18, vol: 0.06, cutoff: 3000 })),
  gameOver: (bus, t) => [69, 65, 62, 57, 50].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'sawtooth', t: t + i * 0.16, dur: 0.4, vol: 0.08, cutoff: 1200 })),
  win: (bus, t) => [72, 76, 79, 84, 79, 84, 88].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'triangle', t: t + i * 0.09, dur: 0.3, vol: 0.1 })),
  count: (bus, t, { high = false }) => tone(bus, { freq: high ? 880 : 587, type: 'square', t, dur: 0.12, vol: 0.07, cutoff: 2500 }),
  achievement: (bus, t, { tier = 'bronze' }) => {
    const top = { bronze: 84, silver: 86, gold: 88, prism: 91 }[tier] || 84;
    [top - 12, top - 5, top].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'triangle', t: t + i * 0.08, dur: 0.5, vol: 0.09, r: 0.35 }));
    tone(bus, { freq: mtof(top + 12), type: 'sine', t: t + 0.24, dur: 0.8, vol: 0.05, r: 0.6 });
  },
  undo: (bus, t) => { tone(bus, { freq: 1180, glideTo: 380, type: 'sine', t, dur: 0.22, vol: 0.09 }); noise(bus, { t, dur: 0.18, vol: 0.05, type: 'bandpass', freq: 1800 }); },
  denied: (bus, t) => tone(bus, { freq: 180, type: 'square', t, dur: 0.08, vol: 0.05, cutoff: 900 }),
  bomb: (bus, t) => { tone(bus, { freq: 160, glideTo: 30, type: 'sawtooth', t, dur: 0.45, vol: 0.16, cutoff: 700 }); noise(bus, { t, dur: 0.5, vol: 0.2, type: 'lowpass', freq: 900 }); },
  miss: (bus, t) => [64, 60].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'triangle', t: t + i * 0.12, dur: 0.2, vol: 0.08 })),
  garbage: (bus, t) => { tone(bus, { freq: 90, glideTo: 140, type: 'sawtooth', t, dur: 0.15, vol: 0.08, cutoff: 600 }); },
  starStart: (bus, t) => {
    tone(bus, { freq: 1600, glideTo: 220, type: 'sine', t, dur: 0.7, vol: 0.12, r: 0.4 });
    [74, 81, 86].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'sine', t: t + 0.05 + i * 0.06, dur: 1.4, vol: 0.05, a: 0.05, r: 1 }));
    noise(bus, { t, dur: 0.8, vol: 0.07, type: 'highpass', freq: 4000 });
  },
  starStack: (bus, t, { total = 1 }) => tone(bus, { freq: mtof(74 + Math.min(total, 16) * 2), type: 'sine', t, dur: 0.6, vol: 0.08, r: 0.5 }),
  starEnd: (bus, t, { lines = 1 }) => {
    tone(bus, { freq: 120, glideTo: 30, type: 'sine', t, dur: 0.9, vol: 0.5, r: 0.6 });
    noise(bus, { t, dur: 1.2, vol: 0.22, type: 'lowpass', freq: 2400 });
    const top = 72 + Math.min(lines, 12);
    [0, 4, 7, 12, 16, 19, 24].forEach((iv, i) => tone(bus, { freq: mtof(top - 12 + iv), type: 'triangle', t: t + 0.04 * i, dur: 1.4, vol: 0.07, r: 1 }));
  },
  ui: (bus, t) => tone(bus, { freq: 660, type: 'sine', t, dur: 0.05, vol: 0.06 }),
  focus: (bus, t) => tone(bus, { freq: 990, type: 'sine', t, dur: 0.03, vol: 0.035 }),
  ...JOURNEY_SFX,
};
