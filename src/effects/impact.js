import { fx } from './state.js';

/** Golpe al tablero: rebote vertical con muelle y, si es fuerte, un leve temblor. */
export function impact(strength, enabled = true) {
  if (!enabled) return;
  fx.bounce.v += strength * 60;
  if (strength > 5) fx.shake = Math.max(fx.shake, strength * 0.6);
}
