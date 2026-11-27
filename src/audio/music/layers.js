import { tone } from '../voices/tone.js';
import { noise } from '../voices/noise.js';
import { mtof } from '../voices/mtof.js';

/**
 * Capas que se suman a la canción según la tensión del tablero.
 * Cada capa decide si suena en este paso; así añadir una capa es añadir una función.
 */
export const TENSION_LAYERS = [
  // Charles en semicorcheas: la pila empieza a subir
  ({ bus, t, inBar, tension }) => {
    if (tension > 0.35 && inBar % 2 === 0) noise(bus, { t, dur: 0.03, vol: 0.035 * tension, freq: 9000, pan: -0.3 });
  },
  // Bajo que dobla en semicorcheas: peligro
  ({ bus, t, inBar, chord, sixteenth, tension }) => {
    if (tension > 0.6 && inBar % 2 === 1) tone(bus, { freq: mtof(chord[0] - 12), type: 'square', t, dur: sixteenth * 0.8, vol: 0.04 * tension, cutoff: 420 });
  },
  // Campana aguda de alarma suave: casi en el techo
  ({ bus, t, inBar, chord, tension }) => {
    if (tension > 0.8 && inBar % 8 === 6) tone(bus, { freq: mtof(chord[2] + 24), type: 'sine', t, dur: 0.25, vol: 0.03, r: 0.2, pan: 0.4 });
  },
  // Golpe de caja extra para empujar
  ({ bus, t, inBar, tension }) => {
    if (tension > 0.5 && inBar === 14) noise(bus, { t, dur: 0.1, vol: 0.08, type: 'bandpass', freq: 2200, q: 0.9 });
  },
];
