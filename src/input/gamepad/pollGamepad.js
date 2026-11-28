import { app } from '../../app/state.js';
import { pad } from './state.js';
import { readPad } from './readPad.js';
import { gameplayPad } from './gameplayPad.js';
import { menuPad } from './menuPad.js';
import { padStatus } from './padStatus.js';

/** Se llama una vez por fotograma: lee el mando y lo envía al juego o al menú. */
export function pollGamepad(dt) {
  try { readAndRoute(dt); } catch (e) { padStatus.error = String(e && e.message || e); } // un fallo nunca para el bucle
}

function readAndRoute(dt) {
  const gp = readPad();
  if (!gp) return;
  padStatus.frames++;
  const inMenu = app.screen !== 'play' && app.screen !== 'countdown';
  const entering = pad.inMenu !== inMenu;
  pad.inMenu = inMenu;
  if (inMenu) { menuPad(gp, dt, entering); pad.held = {}; }
  else gameplayPad(gp, entering);
}
