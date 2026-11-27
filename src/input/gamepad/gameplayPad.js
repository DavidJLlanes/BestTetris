import { PAD_MAP } from '../../config/controls.js';
import { press, release } from '../press.js';
import { pad } from './state.js';
import { button, stickDirs } from './readPad.js';
import { setInput } from '../setInput.js';

/** Traduce el mando a acciones del juego, detectando pulsaciones y sueltas. */
export function gameplayPad(gp, entering) {
  const now = {};
  for (const [i, act] of PAD_MAP) if (button(gp, i)) now[act] = true;
  const stick = stickDirs(gp);
  if (stick.left) now.left = true;
  if (stick.right) now.right = true;
  if (stick.down) now.soft = true;
  // Al volver de un menú, el botón que se usó para salir no debe disparar nada
  if (entering) { pad.held = now; return; }
  for (const act of new Set([...Object.keys(now), ...Object.keys(pad.held)])) {
    if (now[act] && !pad.held[act]) { setInput('pad'); press(act); }
    else if (!now[act] && pad.held[act]) release(act);
  }
  pad.held = now;
}
