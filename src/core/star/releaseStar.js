import { STAR_POINTS } from '../../config/star.js';
import { levelForLines } from '../rules/levelForLines.js';
import { starState } from './starState.js';

/**
 * Fin del momento estelar: todas las filas acumuladas estallan a la vez. Puntúan más cuantas
 * más sean (cada una vale un poco más que la anterior) y cuentan como líneas normales.
 * Devuelve las filas que hay que limpiar (las del fondo) o [] si no se acumuló ninguna.
 */
export function releaseStar(g) {
  const s = starState(g);
  const n = s.stacked;
  s.active = false; s.ending = false; s.stacked = 0; s.time = 0;
  if (!n) { g.emit('starEnd', { lines: 0, points: 0 }); return []; }
  const points = Math.round(STAR_POINTS * g.level * n * (1 + n / 8));
  g.score += points;
  g.lines += n;
  g.stats.starBest = Math.max(g.stats.starBest || 0, n);
  g.emit('starEnd', { lines: n, points });
  g.emit('score', { points, label: `ESTELAR ×${n}`, lines: n, combo: 0, star: true });
  if (g.rules.levelUp) {
    const level = levelForLines(g.lines, g.rules.startLevel, g.rules.linesPerLevel);
    if (level > g.level) { g.level = level; g.emit('levelUp', { level }); }
  }
  const h = g.board.length;
  return Array.from({ length: n }, (_, i) => h - n + i);
}
