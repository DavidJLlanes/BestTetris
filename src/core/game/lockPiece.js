import { HIDDEN } from '../../config/board.js';
import { pieceCells } from '../pieces/pieceCells.js';
import { findFullRows } from '../board/findFullRows.js';
import { detectTSpin } from '../rules/detectTSpin.js';
import { applyScore } from './applyScore.js';
import { spawn } from './spawn.js';
import { topOut } from './topOut.js';

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

  const rows = findFullRows(g.board);
  applyScore(g, rows.length, tspin);
  if (rows.length) {
    g.clearing = { rows, t: 0 };
    g.emit('clear', { rows, types: rows.map((y) => g.board[y].slice()) });
  } else {
    spawn(g);
  }
}
