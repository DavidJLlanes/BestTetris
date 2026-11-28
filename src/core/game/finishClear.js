import { PERFECT_CLEAR_POINTS } from '../../config/scoring.js';
import { removeRows } from '../board/removeRows.js';
import { isBoardEmpty } from '../board/isBoardEmpty.js';
import { spawn } from './spawn.js';
import { finish } from './finish.js';
import { isComplete } from './isComplete.js';

/** Termina la animación de limpieza: quita las filas, comprueba bonus y objetivo. */
export function finishClear(g) {
  // Un modo puede decidir qué filas se van de verdad (polvo que resiste, agujeros que tragan otra)
  const rows = g.hooks.resolveClear ? g.hooks.resolveClear(g, g.clearing.rows) : g.clearing.rows;
  const { board, drops } = removeRows(g.board, rows);
  g.board = board;
  g.clearing = null;
  g.emit('rowsRemoved', { drops });

  if (isBoardEmpty(g.board)) {
    const bonus = PERFECT_CLEAR_POINTS[Math.min(rows.length, 4)] * g.level;
    g.score += bonus;
    g.stats.perfectClears++;
    g.emit('perfectClear', { bonus });
  }
  if (isComplete(g)) { finish(g, true); return; }
  spawn(g);
}
