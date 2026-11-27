import { HIDDEN, TOTAL, COLS } from '../../config/board.js';
import { CLEAR_ANIMATION } from '../../config/timing.js';
import { gemSprite } from '../../render/sprites/gemSprite.js';

/** Bloques fijos de un tablero; las filas que se limpian se encogen y se desvanecen. */
export function drawVersusStack(ctx, g, cell, px) {
  const k = g.clearing ? g.clearing.t / CLEAR_ANIMATION : 0;
  const lost = g.over && !g.won;
  for (let y = HIDDEN; y < TOTAL; y++) {
    const clearing = g.clearing && g.clearing.rows.includes(y);
    for (let x = 0; x < COLS; x++) {
      const t = g.board[y][x];
      if (!t) continue;
      const s = clearing ? cell * (1 - k) : cell;
      if (s < 0.5) continue;
      ctx.globalAlpha = clearing ? 1 - k * 0.6 : 1;
      ctx.drawImage(gemSprite(lost ? 'X' : t, px), x * cell + (cell - s) / 2, (y - HIDDEN) * cell + (cell - s) / 2, s, s);
    }
  }
  ctx.globalAlpha = 1;
}
