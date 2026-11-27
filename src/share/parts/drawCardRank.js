import { CARD_W, FONT } from '../cardSize.js';
import { roundRect } from '../../render/roundRect.js';

/** Línea de nivel, rango y racha bajo el nombre, en una píldora del color del rango. */
export function drawCardRank(ctx, { level, rank, streak }, y) {
  const text = `Nivel ${level} · ${rank.name}${streak ? `  ·  🔥 ${streak}` : ''}`;
  ctx.font = `800 34px ${FONT}`;
  ctx.textAlign = 'center';
  const w = ctx.measureText(text).width + 60, x = (CARD_W - w) / 2;
  ctx.fillStyle = `${rank.color}2e`;
  ctx.strokeStyle = rank.color; ctx.lineWidth = 3;
  roundRect(ctx, x, y - 40, w, 58, 29); ctx.fill(); ctx.stroke();
  ctx.fillStyle = rank.color;
  ctx.fillText(text, CARD_W / 2, y + 2);
}
