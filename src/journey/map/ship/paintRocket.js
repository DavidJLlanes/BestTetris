import { map } from '../mapState.js';

/**
 * El cohete dibujado en su sitio (origen = centro, morro hacia arriba). `roll` lo estrecha como si
 * girase sobre su eje en las curvas; `thrust` alarga la llama mientras vuela.
 */
export function paintRocket(ctx, s, roll, thrust) {
  const w = 1 - Math.abs(roll) * 0.55;
  const flame = 8 + Math.sin(map.time * 40) * 2 + thrust * 10;
  ctx.globalCompositeOperation = 'lighter';
  const f = ctx.createLinearGradient(0, 6 * s, 0, (8 + flame) * s);
  f.addColorStop(0, 'rgba(255,220,150,0.95)');
  f.addColorStop(1, 'rgba(255,100,60,0)');
  ctx.fillStyle = f;
  ctx.beginPath(); ctx.moveTo(-4 * s * w, 6 * s); ctx.lineTo(4 * s * w, 6 * s); ctx.lineTo(0, (8 + flame) * s); ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  ctx.scale(w, 1);
  const body = ctx.createLinearGradient(-7 * s, 0, 7 * s, 0);
  const lit = 0.5 + roll * 0.6; // el brillo se desplaza con el giro
  body.addColorStop(0, '#9fb0ee'); body.addColorStop(Math.max(0.1, Math.min(0.9, lit)), '#ffffff'); body.addColorStop(1, '#7f90d0');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(0, -14 * s);
  ctx.quadraticCurveTo(8 * s, -2 * s, 6 * s, 7 * s);
  ctx.lineTo(-6 * s, 7 * s);
  ctx.quadraticCurveTo(-8 * s, -2 * s, 0, -14 * s);
  ctx.fill();
  ctx.fillStyle = '#ff5fdc';
  const fin = (d) => { ctx.beginPath(); ctx.moveTo(d * 6 * s, 2 * s); ctx.lineTo(d * 11 * s, 9 * s); ctx.lineTo(d * 5 * s, 7 * s); ctx.fill(); };
  fin(-1); fin(1);
  ctx.fillStyle = '#46e6ff';
  ctx.beginPath(); ctx.arc(roll * 3 * s, -3 * s, 2.6 * s, 0, Math.PI * 2); ctx.fill();
}
