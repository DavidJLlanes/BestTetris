/** Cometa: un núcleo de fuego con estela. Al caer rompe todo lo que tiene debajo en su columna. */
export function paintComet(ctx, x, y, s) {
  const cx = x + s / 2, cy = y + s * 0.58;
  const tail = ctx.createLinearGradient(cx, y, cx, cy);
  tail.addColorStop(0, 'rgba(255,170,90,0)');
  tail.addColorStop(1, 'rgba(255,200,120,0.85)');
  ctx.fillStyle = tail;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.12, y + s * 0.04);
  ctx.lineTo(cx + s * 0.12, y + s * 0.04);
  ctx.lineTo(cx + s * 0.3, cy);
  ctx.lineTo(cx - s * 0.3, cy);
  ctx.closePath();
  ctx.fill();
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.36);
  core.addColorStop(0, '#ffffff');
  core.addColorStop(0.45, '#ffe2a8');
  core.addColorStop(0.8, '#ff7a3d');
  core.addColorStop(1, 'rgba(255,80,40,0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.36, 0, Math.PI * 2);
  ctx.fill();
}
