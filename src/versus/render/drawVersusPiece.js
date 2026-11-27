import { HIDDEN } from '../../config/board.js';
import { COLORS } from '../../config/colors.js';
import { pieceCells } from '../../core/pieces/pieceCells.js';
import { ghostY } from '../../core/movement/ghostY.js';
import { gemSprite, GLOW_PAD } from '../../render/sprites/gemSprite.js';
import { roundRect } from '../../render/roundRect.js';

const SMOOTH = 30; // cuanto más alto, antes alcanza la posición real

/** Silueta de caída y pieza activa, con el movimiento horizontal suavizado. */
export function drawVersusPiece(ctx, p, cell, px, dt, ghost) {
  const g = p.game, cur = g.cur;
  if (!cur || g.over) return;
  const k = 1 - Math.exp(-SMOOTH * dt);
  p.mx = p.pieceId === cur ? p.mx + (cur.x - p.mx) * k : cur.x;
  p.pieceId = cur;
  const ox = (p.mx - cur.x) * cell, color = COLORS[cur.type][0];
  if (ghost) {
    ctx.fillStyle = ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    for (const [x, y] of pieceCells(cur, cur.rot, cur.x, ghostY(g))) {
      if (y < HIDDEN) continue;
      roundRect(ctx, x * cell + 2 + ox, (y - HIDDEN) * cell + 2, cell - 4, cell - 4, cell * 0.18);
      ctx.globalAlpha = 0.14; ctx.fill(); ctx.globalAlpha = 0.5; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  const sprite = gemSprite(cur.type, px, true), pad = GLOW_PAD * cell;
  for (const [x, y] of pieceCells(cur)) {
    if (y < HIDDEN - 1) continue;
    ctx.drawImage(sprite, x * cell + ox - pad, (y - HIDDEN) * cell - pad, cell + pad * 2, cell + pad * 2);
  }
}
