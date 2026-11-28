import { map } from './mapState.js';
import { project } from './project.js';
import { shipPos } from './shipPos.js';
import { TRAMOS } from '../tramos.js';
import { tramoAt } from './skyColor.js';
import { paintRocket } from './ship/paintRocket.js';

const P = {};

/**
 * La nave del jugador: flota sobre su parada y, al viajar, baja al camino y lo recorre mirando
 * hacia donde va, se inclina en las curvas y deja estela detrás.
 */
export function drawShip(ctx) {
  const pos = shipPos();
  if (!pos) return;
  const s0 = map.ship, node = map.byId[s0.id];
  project(pos.x, pos.y, P);
  const hover = ((node ? node.r : 34) * P.s + 26 * P.s + Math.sin(map.time * 2.2) * 4 * P.s) * (1 - pos.flying);
  const x = P.x, y = P.y - hover, s = P.s, ang = s0.ang || 0;
  const tint = TRAMOS[Math.floor(tramoAt(pos.y))].tint;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const ly = P.y - hover * 0.4;
  const light = ctx.createRadialGradient(x, ly, 0, x, ly, 150 * s);
  light.addColorStop(0, 'rgba(255,240,210,0.28)');
  light.addColorStop(0.5, `${tint}22`);
  light.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = light;
  ctx.fillRect(x - 150 * s, ly - 150 * s, 300 * s, 300 * s);
  if (pos.flying > 0.2) emitTrail(x, y, s, ang, pos.flying);
  ctx.restore();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  const roll = Math.max(-0.45, Math.min(0.45, (s0.angV || 0) * 0.09)); // se ladea al girar
  paintRocket(ctx, s, roll, pos.flying);
  ctx.restore();
}

/** Chispas que salen por la tobera, hacia atrás según la orientación. */
function emitTrail(x, y, s, ang, k) {
  if (Math.random() > 0.95 * k) return;
  const bx = -Math.sin(ang), by = Math.cos(ang); // hacia la cola
  const tx = x + bx * 14 * s, ty = y + by * 14 * s;
  const sp = 50 + Math.random() * 50;
  map.parts.push({ x: tx, y: ty, vx: bx * sp + (Math.random() - 0.5) * 24, vy: by * sp + (Math.random() - 0.5) * 24, life: 0.65, max: 0.65, r: 2.4 * s, c: Math.random() < 0.5 ? '#ffd9a0' : '#ff9adf' });
}
