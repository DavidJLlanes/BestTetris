import { CARD_W, CARD_H, FONT } from '../../share/cardSize.js';
import { drawCardBackground } from '../../share/parts/drawCardBackground.js';
import { drawCardHeader } from '../../share/parts/drawCardHeader.js';
import { cardData } from '../../share/cardData.js';
import { ALL_LEVELS, SKY_TOTAL, tramoOf } from '../catalog.js';
import { getJourney } from '../progress/journeyStore.js';
import { totalStars, maxStars, wonCount, starsOf } from '../progress/stars.js';
import { balance } from '../progress/wallet.js';
import { drawConstellation } from '../art/drawConstellation.js';
import { formatNumber } from '../../util/formatNumber.js';

const COLS = 10, CELL = 90;

/** Tarjeta para compartir el viaje: tus estrellas y las 64 constelaciones, encendidas las conseguidas. */
export async function buildMapCard() {
  const d = cardData(), p = getJourney();
  const c = document.createElement('canvas');
  c.width = CARD_W; c.height = CARD_H;
  const ctx = c.getContext('2d');
  drawCardBackground(ctx, d.seed);
  await drawCardHeader(ctx, d.identity, '#ffd34f');
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = `900 54px ${FONT}`;
  ctx.fillText('Mi viaje por las estrellas', CARD_W / 2, 560);
  ctx.font = `700 34px ${FONT}`;
  ctx.fillStyle = '#ffd34f';
  ctx.fillText(`★ ${totalStars(p)} / ${maxStars()}   ·   ${wonCount(p, ALL_LEVELS)} de ${SKY_TOTAL} constelaciones   ·   ✦ ${formatNumber(balance(p))}`, CARD_W / 2, 620);
  const x0 = (CARD_W - COLS * CELL) / 2, y0 = 650;
  ALL_LEVELS.forEach((l, i) => {
    const cx = x0 + (i % COLS) * CELL + CELL / 2, cy = y0 + Math.floor(i / COLS) * CELL + CELL / 2;
    const got = starsOf(p, l.id) > 0;
    drawConstellation(ctx, l.sky, cx, cy, CELL * 0.8, { lit: got, color: tramoOf(l).nebula[0], alpha: got ? 1 : 0.35 });
  });
  ctx.fillStyle = 'rgba(236,235,255,0.55)';
  ctx.font = `600 24px ${FONT}`;
  ctx.fillText('djl.com.es/tetris', CARD_W / 2, CARD_H - 40);
  return c;
}
