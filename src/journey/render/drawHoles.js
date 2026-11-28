import { HIDDEN } from '../../config/board.js';
import { view } from '../../render/view.js';

/** Remolino que gira alrededor de cada agujero negro: así se ve que está vivo y que atrae. */
export function drawHoles(ctx, g, now) {
  const cell = view.cell;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineWidth = Math.max(1, cell * 0.06);
  for (let y = HIDDEN; y < g.board.length; y++) {
    const row = g.board[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== 'H') continue;
      const cx = (x + 0.5) * cell, cy = (y - HIDDEN + 0.5) * cell;
      for (let i = 0; i < 3; i++) {
        const a = now / 420 + (i * Math.PI * 2) / 3;
        ctx.strokeStyle = `rgba(210,140,255,${0.55 - i * 0.12})`;
        ctx.beginPath();
        ctx.arc(cx, cy, cell * (0.62 + i * 0.16), a, a + 1.6);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}
