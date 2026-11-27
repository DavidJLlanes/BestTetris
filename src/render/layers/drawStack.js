import { HIDDEN, TOTAL, COLS } from '../../config/board.js';
import { CLEAR_ANIMATION } from '../../config/timing.js';
import { fx } from '../../effects/state.js';
import { view } from '../view.js';
import { gemSprite } from '../sprites/gemSprite.js';

/** Celda de una fila que se está limpiando: se encoge desde el centro hacia los lados. */
function drawClearingCell(ctx, sprite, x, px, py, cell, progress) {
  const order = Math.abs(x - (COLS - 1) / 2) / (COLS / 2);
  const k = Math.max(0, Math.min(1, progress * 1.6 - order * 0.6));
  const ease = k * k * (3 - 2 * k);
  const s = cell * (1 - ease);
  ctx.globalAlpha = 1 - ease * 0.5; // las filas que se limpian se ven siempre, también en Sombra
  if (s > 0.5) ctx.drawImage(sprite, px + (cell - s) / 2, py + (cell - s) / 2, s, s);
  ctx.globalAlpha = 0.7 * (1 - progress);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px, py, cell, cell);
  ctx.globalAlpha = 1;
}

/** Bloques fijos, con la animación de limpieza y las filas que bajan suavemente. */
export function drawStack(ctx, g) {
  const cell = view.cell, px = Math.round(cell * view.dpr);
  const clearing = g.clearing;
  const progress = clearing ? clearing.t / CLEAR_ANIMATION : 0;
  ctx.globalAlpha = g.over ? 1 : g.rules.stackAlpha;
  for (let y = HIDDEN; y < TOTAL; y++) {
    const row = g.board[y];
    const drop = fx.rowOffsets[y] || 0;
    const py = (y - HIDDEN - drop) * cell;
    const clearingRow = clearing && clearing.rows.includes(y);
    for (let x = 0; x < COLS; x++) {
      const t = row[x];
      if (!t) continue;
      const sprite = gemSprite(t, px);
      if (clearingRow) drawClearingCell(ctx, sprite, x, x * cell, py, cell, progress);
      else ctx.drawImage(sprite, x * cell, py, cell, cell);
    }
  }
  ctx.globalAlpha = 1;
}
