import { PAD_MAP } from '../config/controls.js';
import { button, stickDirs } from '../input/gamepad/readPad.js';
import { playerPress, playerRelease } from './playerPress.js';
import { vs } from './state.js';

/** Mandos conectados, en orden: el primero es el Jugador 1 y el segundo el Jugador 2. */
export const connectedPads = () => (navigator.getGamepads ? Array.from(navigator.getGamepads()).filter((p) => p && p.connected) : []);

function readActions(gp) {
  const now = {};
  for (const [i, act] of PAD_MAP) if (button(gp, i)) now[act] = true;
  const s = stickDirs(gp);
  if (s.left) now.left = true;
  if (s.right) now.right = true;
  if (s.down) now.soft = true;
  return now;
}

/** Lee los dos mandos y devuelve true si alguno pulsó Start (pausa). */
export function pollVersusPads(entering) {
  let pause = false;
  connectedPads().slice(0, 2).forEach((gp, i) => {
    const p = vs.players[i], now = readActions(gp);
    if (!entering) {
      for (const act of new Set([...Object.keys(now), ...Object.keys(p.padHeld)])) {
        if (act === 'pause') { if (now.pause && !p.padHeld.pause) pause = true; continue; }
        if (now[act] && !p.padHeld[act]) playerPress(p, act);
        else if (!now[act] && p.padHeld[act]) playerRelease(p, act);
      }
    }
    p.padHeld = now;
  });
  return pause;
}
