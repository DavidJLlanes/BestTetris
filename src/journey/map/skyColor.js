import { TRAMOS } from '../tramos.js';
import { tramoStart } from './layout.js';

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

/** Tramo en el que está la cámara, con decimales (3.4 = entre el cuarto y el quinto). */
export function tramoAt(y) {
  let i = 0;
  while (i < TRAMOS.length - 1 && y >= tramoStart(i + 1)) i++;
  const span = tramoStart(i + 1) - tramoStart(i) || 1;
  return Math.min(TRAMOS.length - 1, i + Math.max(0, (y - tramoStart(i)) / span));
}

/** Los dos colores del cielo a la altura `y`: se funden de un tramo al siguiente. */
export function skyColors(y) {
  const f = tramoAt(y), i = Math.floor(f), t = f - i;
  const k = t < 0.7 ? 0 : (t - 0.7) / 0.3; // el cambio llega al final del tramo
  const a = TRAMOS[i].nebula, b = (TRAMOS[i + 1] || TRAMOS[i]).nebula;
  return [mix(hex(a[0]), hex(b[0]), k), mix(hex(a[1]), hex(b[1]), k)];
}
