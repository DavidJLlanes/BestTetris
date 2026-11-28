import { STICK } from '../../config/controls.js';
import { pad } from './state.js';

/** ¿Hace algo este mando ahora mismo? (algún botón pulsado o un stick movido) */
export const padActive = (gp) => gp.buttons.some((b) => b.pressed || b.value > 0.5) || gp.axes.some((a) => Math.abs(a) > STICK.deadzone);

/**
 * Mando activo, o null. Un receptor inalámbrico expone varias ranuras «conectadas» aunque
 * solo una tenga mando: se usa la que se esté tocando y, si ninguna, la última que se usó.
 */
export function readPad() {
  if (!navigator.getGamepads) return null;
  const pads = Array.from(navigator.getGamepads()).filter((p) => p && p.connected);
  if (!pads.length) return null;
  const busy = pads.find(padActive);
  const gp = busy || pads.find((p) => p.index === pad.index) || pads[0];
  pad.index = gp.index;
  return gp;
}

/** ¿Está pulsado el botón i? (los gatillos cuentan desde la mitad del recorrido) */
export const button = (gp, i) => !!(gp.buttons[i] && (gp.buttons[i].pressed || gp.buttons[i].value > 0.5));

/** Dirección del stick izquierdo como botones virtuales. */
export function stickDirs(gp) {
  const x = gp.axes[0] || 0, y = gp.axes[1] || 0;
  return { left: x < -STICK.deadzone, right: x > STICK.deadzone, down: y > STICK.softDrop, up: y < -STICK.up };
}
