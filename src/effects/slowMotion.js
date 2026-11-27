import { fx } from './state.js';

/**
 * Cámara lenta: el juego avanza a `scale` de su velocidad durante `duration`
 * segundos y vuelve suavemente a la normalidad; además, un pequeño zoom con muelle.
 */
export function slowMotion(duration, scale, zoom = 0) {
  fx.slow = { t: duration, total: duration, scale };
  fx.zoom.v += zoom * 40;
}

/** Factor de tiempo actual (1 = normal). */
export function timeScale() {
  const s = fx.slow;
  if (!s) return 1;
  const k = s.t / s.total;         // 1 al empezar, 0 al terminar
  const ease = k * k;              // recupera la velocidad de forma progresiva
  return 1 - (1 - s.scale) * ease;
}
