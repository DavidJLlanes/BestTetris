const FONT = '"Segoe UI", system-ui, -apple-system, Roboto, sans-serif';

/** Rótulo con halo dibujado una sola vez en un lienzo propio. */
export function textSprite(title, sub, color, cell, dpr) {
  const titlePx = Math.round(cell * 0.85), subPx = Math.round(cell * 0.5);
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = `900 ${titlePx}px ${FONT}`;
  const w = Math.ceil(Math.max(ctx.measureText(title).width, sub ? cell * 6 : 0) + cell * 2);
  const h = Math.ceil(titlePx + (sub ? subPx * 1.6 : 0) + cell * 1.2);
  c.width = w * dpr; c.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${titlePx}px ${FONT}`;
  ctx.shadowColor = color; ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  const ty = cell * 0.6 + titlePx / 2;
  ctx.fillText(title, w / 2, ty);
  if (sub) {
    ctx.shadowBlur = 8;
    ctx.font = `700 ${subPx}px ${FONT}`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(sub, w / 2, ty + titlePx * 0.85);
  }
  return { canvas: c, w, h };
}
