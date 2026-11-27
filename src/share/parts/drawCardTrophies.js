import { CARD_W, FONT } from '../cardSize.js';
import { TIERS } from '../../achievements/tiers.js';

/** Medallero: un círculo por nivel de trofeo con cuántos se han conseguido. */
export function drawCardTrophies(ctx, counts, y) {
  const tiers = Object.entries(TIERS);
  const step = (CARD_W - 120) / tiers.length;
  ctx.textAlign = 'center';
  tiers.forEach(([id, tier], i) => {
    const cx = 60 + step * i + step / 2, cy = y + 70;
    const g = ctx.createRadialGradient(cx - 18, cy - 18, 6, cx, cy, 66);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.25, tier.color); g.addColorStop(1, `${tier.color}55`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, 62, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#120c33'; ctx.font = `900 48px ${FONT}`;
    ctx.fillText(String(counts[id] || 0), cx, cy + 17);
    ctx.fillStyle = '#ecebff'; ctx.font = `700 26px ${FONT}`;
    ctx.fillText(tier.name, cx, cy + 112);
  });
}
