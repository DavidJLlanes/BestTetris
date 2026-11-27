import { CARD_W, FONT } from '../cardSize.js';

async function loadImage(src) {
  const img = new Image();
  img.src = src;
  await img.decode();
  return img;
}

/** Logo, avatar redondo con anillo de color y nombre del jugador. */
export async function drawCardHeader(ctx, identity) {
  const logo = ctx.createLinearGradient(260, 0, 820, 0);
  logo.addColorStop(0, '#46e6ff'); logo.addColorStop(0.5, '#a98bff'); logo.addColorStop(1, '#ff4fd8');
  ctx.fillStyle = logo;
  ctx.font = `900 54px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('BestTris', CARD_W / 2 + 5, 110);
  ctx.letterSpacing = '0px';

  const cx = CARD_W / 2, cy = 300, r = 120;
  const ring = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  ring.addColorStop(0, '#46e6ff'); ring.addColorStop(1, '#ff4fd8');
  ctx.fillStyle = ring;
  ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#241a5e';
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  if (identity.photo) {
    try { ctx.drawImage(await loadImage(identity.photo), cx - r, cy - r, r * 2, r * 2); } catch { /* sin foto */ }
  } else {
    ctx.fillStyle = '#ecebff'; ctx.font = `800 110px ${FONT}`; ctx.textBaseline = 'middle';
    ctx.fillText((identity.name.trim()[0] || '?').toUpperCase(), cx, cy + 6);
    ctx.textBaseline = 'alphabetic';
  }
  ctx.restore();

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 64px ${FONT}`;
  ctx.fillText(identity.name, cx, 500);
}
