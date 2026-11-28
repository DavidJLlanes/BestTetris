import { HIDDEN } from '../../config/board.js';

const POINTS = 800;

/**
 * Estrellas fugaces: cada cierto tiempo una cruza una fila con bloques y se queda unos segundos.
 * Completar esa fila a tiempo la atrapa (puntos y cuenta para el objetivo).
 * Estado en g.custom.shoot = { y, t, life, wait } (y = null si no hay ninguna).
 */
export function tickShooting(g, dt, spec) {
  const s = g.custom.shoot;
  if (s.y !== null) {
    s.t += dt;
    if (s.t >= s.life) { s.y = null; s.wait = spec.every; g.emit('shootingMiss', {}); }
    return;
  }
  s.wait -= dt;
  if (s.wait > 0) return;
  const rows = [];
  for (let y = HIDDEN + 4; y < g.board.length; y++) if (g.board[y].some(Boolean) && !g.board[y].includes('C')) rows.push(y);
  if (!rows.length) { s.wait = 1; return; }
  Object.assign(s, { y: rows[Math.floor(g.random() * rows.length)], t: 0, life: spec.window });
  g.emit('shootingStar', { y: s.y });
}

/** Si la fila de la estrella se va, la estrella se atrapa. */
export function catchShooting(g, rows) {
  const s = g.custom.shoot;
  if (!s || s.y === null || !rows.includes(s.y)) return;
  g.custom.j.shooting++;
  g.score += POINTS * g.level;
  g.emit('shootingCatch', { y: s.y, points: POINTS * g.level });
  s.y = null;
  s.wait = g.custom.shootEvery;
}

/** Las filas que se quitan por debajo bajan la de la estrella. */
export function shiftShooting(g, rows) {
  const s = g.custom.shoot;
  if (!s || s.y === null) return;
  s.y += rows.filter((y) => y > s.y).length;
}
