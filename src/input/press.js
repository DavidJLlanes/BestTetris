import { app, canControl } from '../app/state.js';
import { held } from './state.js';
import { tryMove, tryRotate, hardDrop, holdPiece } from '../core/game/index.js';
import { togglePause } from '../app/pause.js';
import { toggleMute } from '../app/toggleMute.js';
import { initAudio } from '../audio/index.js';

const ROTATIONS = { cw: 1, ccw: -1, r180: 2 };

/**
 * Punto único de entrada de todas las acciones (teclado, mando, táctil).
 * Se ejecuta en el mismo instante de la pulsación: sin esperar al siguiente fotograma.
 */
export function press(act) {
  initAudio();
  if (act === 'mute') return toggleMute();
  if (act === 'pause') return togglePause();
  const g = app.game;
  if (act === 'left' || act === 'right') {
    held[act] = true;
    held.dir = act === 'left' ? -1 : 1;
    held.dasT = 0; held.arrT = 0;
    if (canControl()) tryMove(g, held.dir, 0);
    return;
  }
  if (act === 'soft') { if (g) g.softDrop = true; return; }
  if (!canControl()) return;
  if (act === 'hard') hardDrop(g);
  else if (act === 'hold') holdPiece(g);
  else if (ROTATIONS[act]) tryRotate(g, ROTATIONS[act]);
}

export function release(act) {
  if (act === 'left' || act === 'right') {
    held[act] = false;
    held.dir = held.left ? -1 : held.right ? 1 : 0;
    if (held.dir) { held.dasT = 0; held.arrT = 0; }
  }
  if (act === 'soft' && app.game) app.game.softDrop = false;
}
