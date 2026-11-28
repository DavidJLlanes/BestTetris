import { tone } from '../voices/tone.js';
import { noise } from '../voices/noise.js';
import { mtof } from '../voices/mtof.js';

const PENTA = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96];

/** Sonidos del Viaje: el mapa, las constelaciones que se encienden y los elementos del tablero. */
export const JOURNEY_SFX = {
  // Cada estrella que se enciende sube por una escala pentatónica (i = orden)
  jStar: (bus, t, { i = 0 }) => tone(bus, { freq: mtof(PENTA[i % PENTA.length]), type: 'sine', t, dur: 0.5, vol: 0.07, r: 0.4 }),
  // La figura entera: acorde brillante con destello
  jConstellation: (bus, t) => {
    [72, 79, 84, 88, 91].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'triangle', t: t + i * 0.06, dur: 1.4, vol: 0.06, r: 1 }));
    noise(bus, { t, dur: 0.6, vol: 0.05, type: 'highpass', freq: 6000 });
  },
  jReward: (bus, t, { i = 0 }) => [84, 88, 91].forEach((m, k) => tone(bus, { freq: mtof(m + i * 2), type: 'sine', t: t + k * 0.05, dur: 0.35, vol: 0.07 })),
  jWhoosh: (bus, t) => noise(bus, { t, dur: 0.45, vol: 0.09, type: 'bandpass', freq: 1400 }),
  jUnlock: (bus, t) => [76, 83, 88].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'sine', t: t + i * 0.09, dur: 0.6, vol: 0.08, r: 0.45 })),
  jShip: (bus, t) => tone(bus, { freq: 220, glideTo: 660, type: 'triangle', t, dur: 0.9, vol: 0.05, r: 0.6 }),
  jCatch: (bus, t) => [88, 91, 96].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'sine', t: t + i * 0.04, dur: 0.4, vol: 0.08 })),
  jCrack: (bus, t) => noise(bus, { t, dur: 0.12, vol: 0.12, type: 'bandpass', freq: 2600 }),
  jThaw: (bus, t) => tone(bus, { freq: 1400, glideTo: 700, type: 'sine', t, dur: 0.3, vol: 0.06 }),
  jHole: (bus, t) => tone(bus, { freq: 120, glideTo: 40, type: 'sawtooth', t, dur: 0.7, vol: 0.1, cutoff: 500 }),
  jBossWarn: (bus, t) => [55, 55].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'square', t: t + i * 0.2, dur: 0.14, vol: 0.06, cutoff: 900 })),
  jBossHit: (bus, t) => { tone(bus, { freq: 200, glideTo: 90, type: 'square', t, dur: 0.2, vol: 0.08, cutoff: 1400 }); noise(bus, { t, dur: 0.15, vol: 0.08, type: 'lowpass', freq: 1200 }); },
  jBuy: (bus, t) => [79, 84, 91].forEach((m, i) => tone(bus, { freq: mtof(m), type: 'triangle', t: t + i * 0.05, dur: 0.25, vol: 0.07 })),
};
