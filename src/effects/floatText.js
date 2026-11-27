import { fx } from './state.js';

/** Texto que aparece sobre el tablero y se desvanece. offset en filas. */
export function floatText(title, sub = '', color = '#fff', scale = 1, offset = 0) {
  fx.texts.push({ title, sub, color, scale, offset, t: 0 });
}
