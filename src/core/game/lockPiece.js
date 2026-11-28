import { HIDDEN } from '../../config/board.js';
import { pieceCells } from '../pieces/pieceCells.js';
import { findFullRows } from '../board/findFullRows.js';
import { detectTSpin } from '../rules/detectTSpin.js';
import { applyScore } from './applyScore.js';
import { spawn } from './spawn.js';
import { topOut } from './topOut.js';
import { starState } from '../star/starState.js';
import { stackStarRows } from '../star/stackStarRows.js';
import { releaseStar } from '../star/releaseStar.js';

/** Filas completas que se pueden limpiar: un modo puede retener algunas (hielo del Viaje). */
const clearable = (g, rows) => (g.hooks.filterRows ? g.hooks.filterRows(g, rows) : rows);

/** Fija la pieza activa en el tablero, puntúa y lanza la limpieza o la siguiente pieza. */
export function lockPiece(g, hard = false) {
  const p = g.cur;
  const tspin = detectTSpin(g.board, p, g.lastRotate, g.lastKick);
  const cells = pieceCells(p);
  cells.forEach(([x, y]) => { if (y >= 0) g.board[y][x] = p.type; });
  g.cur = null;
  g.holdUsed = false;
  g.stats.pieces++;
  g.emit('lock', { type: p.type, cells, hard, piece: { ...p } });
  if (g.hooks.onLock) g.hooks.onLock(g, p, cells);
  if (g.over) return;

  if (cells.every(([, y]) => y < HIDDEN)) { topOut(g); return; }

  const star = g.rules.star && starState(g);
  if (star && star.active) { lockDuringStar(g, star, tspin); return; }

  const rows = clearable(g, findFullRows(g.board));
  applyScore(g, rows.length, tspin);
  if (rows.length) {
    g.clearing = { rows, t: 0 };
    g.emit('clear', { rows, types: rows.map((y) => g.board[y].slice()) });
  } else {
    spawn(g);
  }
}

/**
 * Momento estelar: las filas completas bajan al fondo y se acumulan (sin puntuar todavía).
 * Si el tiempo ya se acabó, al fijar esta pieza estallan todas las acumuladas.
 */
function lockDuringStar(g, star, tspin) {
  const h = g.board.length;
  const rows = clearable(g, findFullRows(g.board)).filter((y) => y < h - star.stacked);
  if (rows.length) {
    g.board = stackStarRows(g.board, rows, star.stacked);
    star.stacked += rows.length;
    g.emit('starStack', { rows: rows.length, total: star.stacked });
  } else if (!star.ending) applyScore(g, 0, tspin);
  if (!star.ending) { spawn(g); return; }
  const release = releaseStar(g);
  if (!release.length) { spawn(g); return; }
  g.clearing = { rows: release, t: 0 };
  g.emit('clear', { rows: release, types: release.map((y) => g.board[y].slice()), star: true });
}
