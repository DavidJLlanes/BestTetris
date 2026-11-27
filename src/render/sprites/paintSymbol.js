/**
 * Símbolo blanco distinto para cada pieza, para distinguirlas sin depender del color.
 * cx, cy: centro; r: radio útil.
 */
const SYMBOLS = {
  I: (c, x, y, r) => { c.fillRect(x - r, y - r * 0.18, r * 2, r * 0.36); },
  O: (c, x, y, r) => { c.lineWidth = r * 0.34; c.beginPath(); c.arc(x, y, r * 0.72, 0, Math.PI * 2); c.stroke(); },
  T: (c, x, y, r) => { c.beginPath(); c.moveTo(x, y - r); c.lineTo(x + r, y + r * 0.8); c.lineTo(x - r, y + r * 0.8); c.closePath(); c.fill(); },
  S: (c, x, y, r) => { c.lineWidth = r * 0.36; c.beginPath(); c.moveTo(x - r, y + r); c.lineTo(x + r, y - r); c.stroke(); },
  Z: (c, x, y, r) => { c.lineWidth = r * 0.36; c.beginPath(); c.moveTo(x - r, y - r); c.lineTo(x + r, y + r); c.stroke(); },
  J: (c, x, y, r) => { c.beginPath(); c.moveTo(x - r, y); c.lineTo(x + r * 0.7, y - r); c.lineTo(x + r * 0.7, y + r); c.closePath(); c.fill(); },
  L: (c, x, y, r) => { c.beginPath(); c.moveTo(x + r, y); c.lineTo(x - r * 0.7, y - r); c.lineTo(x - r * 0.7, y + r); c.closePath(); c.fill(); },
};

export function paintSymbol(ctx, type, cx, cy, r) {
  const draw = SYMBOLS[type];
  if (!draw) return;
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = r * 0.3;
  ctx.lineCap = 'round';
  draw(ctx, cx, cy, r);
  ctx.restore();
}
