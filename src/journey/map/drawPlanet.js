/** Media elipse del anillo: la de atrás (arriba) o la de delante (abajo). */
function ring(ctx, cx, cy, R, front) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, R * 1.6, R * 0.42, -0.35, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
  ctx.stroke();
}

/** Planeta tienda: esfera con luz lateral, anillo inclinado y halo. Apagado si aún no se ha llegado. */
export function drawPlanet(ctx, cx, cy, R, color, on) {
  const halo = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.7);
  halo.addColorStop(0, on ? color : 'rgba(110,110,150,0.4)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = on ? 0.45 : 0.2;
  ctx.fillStyle = halo;
  ctx.fillRect(cx - R * 1.7, cy - R * 1.7, R * 3.4, R * 3.4);
  ctx.globalAlpha = on ? 1 : 0.55;
  ctx.strokeStyle = on ? 'rgba(255,240,210,0.75)' : 'rgba(180,180,210,0.35)';
  ctx.lineWidth = Math.max(1.5, R * 0.1);
  ring(ctx, cx, cy, R, false);
  const ball = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.45, R * 0.1, cx, cy, R);
  ball.addColorStop(0, '#ffffff');
  ball.addColorStop(0.25, on ? color : '#8a8aa8');
  ball.addColorStop(1, on ? 'rgba(20,10,50,1)' : 'rgba(20,20,35,1)');
  ctx.fillStyle = ball;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
  ring(ctx, cx, cy, R, true);
  ctx.globalAlpha = 1;
}
