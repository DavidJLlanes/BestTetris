import { audio } from '../context.js';

/** Nodo de salida hacia un bus, con panorama estéreo opcional (-1 izquierda, 1 derecha). */
export function output(bus, pan = 0) {
  if (!pan || !audio.ctx.createStereoPanner) return bus;
  const p = audio.ctx.createStereoPanner();
  p.pan.value = Math.max(-1, Math.min(1, pan));
  p.connect(bus);
  return p;
}
