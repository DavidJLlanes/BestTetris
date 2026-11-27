import { scoreClear } from '../rules/scoreClear.js';
import { levelForLines } from '../rules/levelForLines.js';

/** Aplica al estado la puntuación de un bloqueo y avisa de lo ocurrido. */
export function applyScore(g, lines, tspin) {
  const r = scoreClear({ lines, tspin, level: g.level, combo: g.combo, b2b: g.b2b });
  g.score += r.points;
  g.combo = r.combo;
  g.b2b = r.b2b;
  if (tspin === 'full') g.stats.tspins++;
  if (lines >= 4) g.stats.quads++;
  if (r.backToBack) { g.stats.b2bChain++; g.stats.b2bMax = Math.max(g.stats.b2bMax, g.stats.b2bChain); }
  else if (lines) g.stats.b2bChain = 0;
  g.stats.maxCombo = Math.max(g.stats.maxCombo, r.combo);
  if (r.points || r.label) g.emit('score', { ...r, lines, tspin });

  if (!lines) return;
  g.lines += lines;
  if (!g.rules.levelUp) return;
  const level = levelForLines(g.lines, g.rules.startLevel, g.rules.linesPerLevel);
  if (level > g.level) { g.level = level; g.emit('levelUp', { level }); }
}
