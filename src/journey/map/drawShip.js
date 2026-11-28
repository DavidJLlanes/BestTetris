import { map } from './mapState.js';
import { project } from './project.js';
import { shipPos } from './shipPos.js';
import { TRAMOS } from '../tramos.js';
import { tramoAt } from './skyColor.js';

const P = {};

/**
 * La nave del jugador: flota sobre su parada con una luz que ilumina el camino a su alrededor
 * y deja estela cuando viaja a la siguiente.
 */
export function drawShip(ctx, dt) {
  const pos = shipPos();
  if (!pos) return;
  const node = map.byId[map.ship.id];
  project(pos.x, pos.y, P);
  const lift = (node ? node.r : 34) * P.s + 26 * P.s + Math.sin(map.time * 2.2) * 4 * P.s;
  const x = P.x, y = P.y - lift, s = P.s;
  const tint = TRAMOS[Math.floor(tramoAt(pos.y))].tint;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const light = ctx.createRadialGradient(x, y + lift * 0.6, 0, x, y + lift * 0.6, 150 * s);
  light.addColorStop(0, 'rgba(255,240,210,0.28)');
  light.addColorStop(0.5, `${tint}22`);
  light.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = light;
  ctx.fillRect(x - 150 * s, y + lift * 0.6 - 150 * s, 300 * s, 300 * s);
  if (map.ship.t < 1 && Math.random() < 0.9) map.parts.push({ x, y: y + 10 * s, vx: (Math.random() - 0.5) * 30, vy: 40 + Math.random() * 40, life: 0.6, max: 0.6, r: 2.4 * s, c: '#ffd9a0' });
  const flame = 8 + Math.sin(map.time * 40) * 2 + (map.ship.t < 1 ? 8 : 0);
  const f = ctx.createLinearGradient(x, y + 6 * s, x, y + (8 + flame) * s);
  f.addColorStop(0, 'rgba(255,220,150,0.95)');
  f.addColorStop(1, 'rgba(255,100,60,0)');
  ctx.fillStyle = f;
  ctx.beginPath(); ctx.moveTo(x - 4 * s, y + 6 * s); ctx.lineTo(x + 4 * s, y + 6 * s); ctx.lineTo(x, y + (8 + flame) * s); ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  const body = ctx.createLinearGradient(x - 7 * s, 0, x + 7 * s, 0);
  body.addColorStop(0, '#c9d6ff'); body.addColorStop(0.5, '#ffffff'); body.addColorStop(1, '#8fa0e0');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(x, y - 14 * s);
  ctx.quadraticCurveTo(x + 8 * s, y - 2 * s, x + 6 * s, y + 7 * s);
  ctx.lineTo(x - 6 * s, y + 7 * s);
  ctx.quadraticCurveTo(x - 8 * s, y - 2 * s, x, y - 14 * s);
  ctx.fill();
  ctx.fillStyle = '#ff5fdc';
  ctx.beginPath(); ctx.moveTo(x - 6 * s, y + 2 * s); ctx.lineTo(x - 11 * s, y + 9 * s); ctx.lineTo(x - 5 * s, y + 7 * s); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 6 * s, y + 2 * s); ctx.lineTo(x + 11 * s, y + 9 * s); ctx.lineTo(x + 5 * s, y + 7 * s); ctx.fill();
  ctx.fillStyle = '#46e6ff';
  ctx.beginPath(); ctx.arc(x, y - 3 * s, 2.6 * s, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
