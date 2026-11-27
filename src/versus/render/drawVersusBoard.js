import { COLS, ROWS } from '../../config/board.js';
import { backdropSprite } from '../../render/sprites/backdropSprite.js';
import { drawVersusStack } from './drawVersusStack.js';
import { drawVersusPiece } from './drawVersusPiece.js';

/** Un tablero completo del modo a dos, con el medidor de basura que llega por la izquierda. */
export function drawVersusBoard(ctx, p, { cell, dpr, dt, settings }) {
  const W = COLS * cell, H = ROWS * cell, px = Math.round(cell * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(backdropSprite(cell, dpr, settings.grid), 0, 0, W, H);
  drawVersusStack(ctx, p.game, cell, px);
  drawVersusPiece(ctx, p, cell, px, dt, settings.ghost);
  if (p.pending) {
    const h = Math.min(H, p.pending * cell);
    ctx.fillStyle = '#ff3d6e'; ctx.shadowColor = '#ff3d6e'; ctx.shadowBlur = 12;
    ctx.fillRect(0, H - h, Math.max(4, cell * 0.16), h);
    ctx.shadowBlur = 0;
  }
  if (p.flash > 0) {
    ctx.fillStyle = `rgba(255,61,110,${p.flash * 0.22})`; ctx.fillRect(0, 0, W, H);
    p.flash = Math.max(0, p.flash - dt * 3);
  }
  if (p.game.over && !p.game.won) { ctx.fillStyle = 'rgba(8,6,24,.55)'; ctx.fillRect(0, 0, W, H); }
}
