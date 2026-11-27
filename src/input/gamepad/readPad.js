import { STICK } from '../../config/controls.js';
import { pad } from './state.js';

/** Mando activo (el último usado o el primero conectado), o null. */
export function readPad() {
  if (!navigator.getGamepads) return null;
  const pads = navigator.getGamepads();
  let gp = pad.index !== null ? pads[pad.index] : null;
  if (!gp) gp = Array.from(pads).find((p) => p && p.connected) || null;
  if (gp) pad.index = gp.index;
  return gp;
}

/** ¿Está pulsado el botón i? (los gatillos cuentan desde la mitad del recorrido) */
export const button = (gp, i) => !!(gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.5));

/** Dirección del stick izquierdo como botones virtuales. */
export function stickDirs(gp) {
  const x = gp.axes[0] || 0, y = gp.axes[1] || 0;
  return { left: x < -STICK.deadzone, right: x > STICK.deadzone, down: y > STICK.softDrop, up: y < -STICK.up };
}
