/** Agujero negro: un pozo oscuro con su disco de luz. Al limpiar su fila se traga también la de debajo. */
export function paintHole(ctx, x, y, s) {
  const cx = x + s / 2, cy = y + s / 2;
  const disc = ctx.createRadialGradient(cx, cy, s * 0.12, cx, cy, s * 0.5);
  disc.addColorStop(0, '#000');
  disc.addColorStop(0.45, '#12052a');
  disc.addColorStop(0.62, '#c86bff');
  disc.addColorStop(0.75, 'rgba(255,140,220,0.55)');
  disc.addColorStop(1, 'rgba(80,20,140,0)');
  ctx.fillStyle = disc;
  ctx.fillRect(x, y, s, s);
  ctx.strokeStyle = 'rgba(255,220,255,0.75)';
  ctx.lineWidth = Math.max(1, s * 0.05);
  ctx.beginPath();
  ctx.ellipse(cx, cy, s * 0.42, s * 0.14, -0.4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(cx, cy, s * 0.16, 0, Math.PI * 2);
  ctx.fill();
}
