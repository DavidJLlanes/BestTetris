import { on } from '../bus.js';
import { app } from '../state.js';
import { HIDDEN } from '../../config/board.js';
import { COLORS } from '../../config/colors.js';
import { pieceCells } from '../../core/pieces/pieceCells.js';
import { fx } from '../../effects/state.js';
import { spawnParticles } from '../../effects/spawnParticles.js';

const MAX_AFTER = 6;
const on_ = () => app.settings.particles;

/**
 * Luz extra de las jugadas (ajuste «Partículas y estelas»): estela al mover y girar,
 * salpicadura con onda al soltar, barrido por cada fila hecha y lluvia de chispas en combos.
 */
export function sparkleReactions() {
  on('move', ({ piece, dx }) => {
    if (!on_()) return;
    const cells = pieceCells({ ...piece, x: piece.x - dx });
    fx.afterimages.push({ cells, color: COLORS[piece.type][0], t: 0, life: 0.16 });
    if (fx.afterimages.length > MAX_AFTER) fx.afterimages.shift();
  });
  on('rotate', ({ piece }) => {
    if (!on_()) return;
    fx.afterimages.push({ cells: pieceCells(piece), color: COLORS[piece.type][1] || COLORS[piece.type][0], t: 0, life: 0.2 });
    if (fx.afterimages.length > MAX_AFTER) fx.afterimages.shift();
  });
  on('hardDrop', ({ piece, distance }) => {
    if (!on_()) return;
    const cells = pieceCells(piece); // la pieza ya llega en su sitio final
    const color = COLORS[piece.type][0];
    let left = 99, right = -1, bottom = -1;
    for (const [x, y] of cells) { left = Math.min(left, x); right = Math.max(right, x); bottom = Math.max(bottom, y); }
    const by = bottom - HIDDEN + 1;
    fx.rings.push({ x: (left + right + 1) / 2, y: by, w: right - left + 1, color, t: 0, life: 0.45 });
    const k = Math.min(1, 0.4 + distance / 14);
    for (let x = left; x <= right; x++) {
      for (const side of [-1, 1]) spawnParticles(x + 0.5, by - 0.05, color, 3 * k, { vx: side * (1 + Math.random() * 5), vy: -(4 + Math.random() * 7) * k, life: 0.5, size: 2, gravity: 1.4 });
    }
  });
  on('clear', ({ rows, types }) => {
    if (!on_()) return;
    rows.forEach((y, i) => {
      const t = types[i].find(Boolean) || 'I';
      fx.sweeps.push({ y: y - HIDDEN, color: COLORS[t][0], t: -i * 0.04, life: 0.42 });
      for (let x = 0; x < 10; x++) spawnParticles(x + 0.5, y - HIDDEN + 0.5, COLORS[types[i][x] || t][0], 1 + rows.length * 0.5, { speed: 3 + rows.length * 2.5, life: 0.7 + rows.length * 0.12, size: 2.2, gravity: 0.35 });
    });
  });
  on('score', ({ combo }) => {
    if (!on_() || !(combo > 1)) return;
    for (let i = 0; i < Math.min(combo, 8) * 3; i++) spawnParticles(Math.random() * 10, -0.5, '#ff7be6', 1, { vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, life: 1.2, size: 1.8, gravity: 0.25 });
  });
}
