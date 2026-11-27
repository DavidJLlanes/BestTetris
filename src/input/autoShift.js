import { app, canControl } from '../app/state.js';
import { tryMove, shiftToWall } from '../core/game/index.js';
import { held } from './state.js';

/**
 * Desplazamiento automático al mantener una dirección: tras `das` ms empieza a
 * deslizarse una casilla cada `arr` ms (0 = directamente hasta la pared).
 */
export function updateAutoShift(dt) {
  if (!held.dir || app.screen !== 'play') return;
  held.dasT += dt;
  const das = app.settings.das / 1000, arr = app.settings.arr / 1000;
  if (held.dasT < das || !canControl()) return;
  if (arr === 0) { shiftToWall(app.game, held.dir); return; }
  held.arrT += dt;
  while (held.arrT >= arr) {
    held.arrT -= arr;
    if (!tryMove(app.game, held.dir, 0)) { held.arrT = 0; break; }
  }
}

/** Si la dirección ya estaba cargada cuando aparece una pieza, se aplica al instante. */
export function applyChargedShift() {
  if (!held.dir || held.dasT < app.settings.das / 1000) return;
  if (app.settings.arr === 0) shiftToWall(app.game, held.dir);
  else tryMove(app.game, held.dir, 0);
}
