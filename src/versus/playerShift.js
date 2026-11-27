import { app } from '../app/state.js';
import { tryMove, shiftToWall } from '../core/game/index.js';

const can = (g) => !!g.cur && !g.clearing && !g.over;

/** Desplazamiento automático de un jugador (los mismos tiempos de los ajustes). */
export function updateShift(p, dt) {
  const h = p.input, g = p.game;
  if (!h.dir) return;
  h.dasT += dt;
  const das = app.settings.das / 1000, arr = app.settings.arr / 1000;
  if (h.dasT < das || !can(g)) return;
  if (arr === 0) { shiftToWall(g, h.dir); return; }
  h.arrT += dt;
  while (h.arrT >= arr) { h.arrT -= arr; if (!tryMove(g, h.dir, 0)) { h.arrT = 0; break; } }
}

/** Si la dirección ya estaba cargada al aparecer la pieza, se aplica al momento. */
export function applyCharged(p) {
  const h = p.input;
  if (!h.dir || h.dasT < app.settings.das / 1000) return;
  if (app.settings.arr === 0) shiftToWall(p.game, h.dir); else tryMove(p.game, h.dir, 0);
}
