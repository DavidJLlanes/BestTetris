import { CARD_W, CARD_H } from '../cardSize.js';
import { COLORS } from '../../config/colors.js';
import { paintGem } from '../../render/sprites/paintGem.js';
import { seededRandom } from '../../util/seededRandom.js';

/** Fondo oscuro con auroras y una lluvia de gemas decorativa. */
export function drawCardBackground(ctx, seed) {
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, '#1a1145'); bg.addColorStop(1, '#07051a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  for (const [x, y, r, c] of [[100, 120, 520, '#5a1fff'], [1000, 500, 560, '#ff2fb4'], [400, 1300, 600, '#00b3d9']]) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `${c}66`); g.addColorStop(1, `${c}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
  }
  const rng = seededRandom(seed);
  const types = Object.keys(COLORS).filter((t) => t.length === 1 && t !== 'X' && t !== 'G');
  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 26; i++) {
    const s = 30 + rng() * 50;
    paintGem(ctx, rng() * CARD_W, rng() * CARD_H, s, types[Math.floor(rng() * types.length)]);
  }
  ctx.globalAlpha = 1;
}
