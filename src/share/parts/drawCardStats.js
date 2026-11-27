import { CARD_W, FONT } from '../cardSize.js';
import { roundRect } from '../../render/roundRect.js';

/** Fila de cifras destacadas dentro de cristales. */
export function drawCardStats(ctx, stats, y) {
  const n = stats.length, gap = 24, w = (CARD_W - 120 - gap * (n - 1)) / n, h = 150;
  stats.forEach(([label, value], i) => {
    const x = 60 + i * (w + gap);
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    roundRect(ctx, x, y, w, h, 24); ctx.fill();
    ctx.strokeStyle = 'rgba(200,190,255,0.22)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff'; ctx.font = `800 50px ${FONT}`;
    ctx.fillText(String(value), x + w / 2, y + 78);
    ctx.fillStyle = '#9b97c9'; ctx.font = `600 24px ${FONT}`;
    ctx.fillText(label.toUpperCase(), x + w / 2, y + 120);
  });
}
