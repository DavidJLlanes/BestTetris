import { lockPiece } from '../../core/game/lockPiece.js';
import { finishClear } from '../../core/game/finishClear.js';
import { cloneGame } from './cloneGame.js';
import { placements } from './placements.js';

const stateKey = (g) => `${g.board.map((r) => r.map((c) => (c ? 1 : 0)).join('')).join('')}|${g.cur.type}|${g.queue.join('')}|${(g.custom.sequence || []).join('')}|${g.lines}|${g.stats.tspinBest || 0}|${g.stats.perfectClears}|${g.custom.placed || 0}`;

/**
 * ¿Existe alguna forma de cumplir el objetivo con las piezas dadas (sin reserva)?
 * budget limita las posiciones probadas: si se agota, lanza 'budget' (no se sabe).
 */
export function solvable(g, budget = { left: Infinity }, depth = 0, dead = new Set()) {
  if (g.over) return g.won;
  if (depth > 12 || !g.cur) return false;
  // Órdenes distintos llevan al mismo tablero: si ya falló, no se repite
  const key = stateKey(g);
  if (dead.has(key)) return false;
  for (const s of placements(g)) {
    if (--budget.left < 0) throw new Error('budget');
    const n = cloneGame(s);
    lockPiece(n, false);
    if (n.clearing) finishClear(n);
    if (n.over ? n.won : solvable(n, budget, depth + 1, dead)) return true;
  }
  dead.add(key);
  return false;
}
