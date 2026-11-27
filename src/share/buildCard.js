import { CARD_W, CARD_H, FONT } from './cardSize.js';
import { cardData } from './cardData.js';
import { drawCardBackground } from './parts/drawCardBackground.js';
import { drawCardHeader } from './parts/drawCardHeader.js';
import { drawCardStats } from './parts/drawCardStats.js';
import { drawCardTrophies } from './parts/drawCardTrophies.js';
import { drawCardRecords } from './parts/drawCardRecords.js';
import { drawCardRank } from './parts/drawCardRank.js';

/** Dibuja la tarjeta de progreso completa en un lienzo, sin salir del navegador. */
export async function buildCard() {
  const d = cardData();
  const c = document.createElement('canvas');
  c.width = CARD_W; c.height = CARD_H;
  const ctx = c.getContext('2d');
  drawCardBackground(ctx, d.seed);
  await drawCardHeader(ctx, d.identity, d.progress.rank.color);
  drawCardRank(ctx, d.progress, 560);
  drawCardStats(ctx, d.stats, 600);
  drawCardTrophies(ctx, d.tierCounts, 790);
  drawCardRecords(ctx, d.records, 1040);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(236,235,255,0.55)';
  ctx.font = `600 24px ${FONT}`;
  ctx.fillText('djl.com.es/tetris', CARD_W / 2, CARD_H - 40);
  return c;
}
