import { tryMove, tryRotate, hardDrop, holdPiece } from '../core/game/index.js';

const ROT = { cw: 1, ccw: -1, r180: 2 };
const can = (g) => !!g.cur && !g.clearing && !g.over;

/** Acción de un jugador (teclado o mando), igual que en una partida normal. */
export function playerPress(p, act) {
  const g = p.game, h = p.input;
  if (act === 'left' || act === 'right') {
    h[act] = true; h.dir = act === 'left' ? -1 : 1; h.dasT = 0; h.arrT = 0;
    if (can(g)) tryMove(g, h.dir, 0);
    return;
  }
  if (act === 'soft') { g.softDrop = true; return; }
  if (!can(g)) return;
  if (act === 'hard') hardDrop(g);
  else if (act === 'hold') holdPiece(g);
  else if (ROT[act]) tryRotate(g, ROT[act]);
}

export function playerRelease(p, act) {
  const h = p.input;
  if (act === 'left' || act === 'right') {
    h[act] = false; h.dir = h.left ? -1 : h.right ? 1 : 0;
    if (h.dir) { h.dasT = 0; h.arrT = 0; }
  }
  if (act === 'soft') p.game.softDrop = false;
}
