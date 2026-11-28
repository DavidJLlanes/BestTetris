/** Una estrella: halo del color dado y núcleo blanco. Sin shadowBlur (es caro en móviles). */
export function drawStarDot(ctx, x, y, r, color, alpha = 1, bright = true) {
  ctx.globalAlpha = alpha * (bright ? 0.55 : 0.3);
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = bright ? '#ffffff' : 'rgba(220,225,255,0.7)';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
