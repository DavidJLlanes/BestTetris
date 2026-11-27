import { HIDDEN } from '../../config/board.js';
import { highestRow } from '../../core/board/highestRow.js';
import { view } from '../view.js';

const DANGER_ROWS = 6;

/** Tinte rojo que late cuando la pila se acerca al techo. */
export function drawDanger(ctx, g, now) {
  const level = Math.max(0, (HIDDEN + DANGER_ROWS - highestRow(g.board)) / DANGER_ROWS);
  if (!level || g.over) return;
  ctx.fillStyle = `rgba(255,40,90,${0.09 * level * (0.6 + 0.4 * Math.sin(now / 160))})`;
  ctx.fillRect(0, 0, view.width, view.height);
}
