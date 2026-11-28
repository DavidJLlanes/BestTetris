import { TRAMOS } from '../tramos.js';
import { drawConstellation } from '../art/drawConstellation.js';
import { drawPlanet } from './drawPlanet.js';

const MAX = 28; // sprites guardados a la vez (las paradas lejanas se rehacen al volver)
const cache = new Map();
export const SPRITE_PAD = 1.7; // el sprite mide 2 × radio × esto (deja sitio al halo)

/**
 * Emblema de una parada pre-dibujado: halo, disco de cristal con el color de su tramo y la
 * constelación dentro (encendida si está conseguida). Se dibuja una vez y luego solo se copia.
 */
export function nodeSprite(node, state, res) {
  const key = `${node.id}|${state}|${res}`;
  if (cache.has(key)) { const c = cache.get(key); cache.delete(key); cache.set(key, c); return c; }
  const size = Math.ceil(node.r * 2 * SPRITE_PAD * res);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const R = node.r * res, m = size / 2;
  const color = TRAMOS[node.tramo].nebula[0];
  if (node.kind === 'shop') drawPlanet(ctx, m, m, R, node.planet.color, state !== 'locked');
  else paintDisc(ctx, m, R, color, state, node.kind === 'boss');
  if (node.level) drawConstellation(ctx, node.level.sky, m, m, R * 1.45, { lit: state === 'done', color, alpha: state === 'locked' ? 0.45 : 1 });
  cache.set(key, c);
  if (cache.size > MAX) cache.delete(cache.keys().next().value);
  return c;
}

function paintDisc(ctx, m, R, color, state, boss) {
  const on = state !== 'locked';
  const halo = ctx.createRadialGradient(m, m, R * 0.6, m, m, R * SPRITE_PAD);
  halo.addColorStop(0, on ? color : 'rgba(120,130,190,0.5)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = state === 'done' ? 0.55 : on ? 0.35 : 0.18;
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, m * 2, m * 2);
  ctx.globalAlpha = 1;
  const disc = ctx.createRadialGradient(m - R * 0.3, m - R * 0.35, R * 0.1, m, m, R);
  disc.addColorStop(0, on ? 'rgba(60,50,120,0.95)' : 'rgba(40,40,70,0.95)');
  disc.addColorStop(1, on ? 'rgba(12,8,40,0.98)' : 'rgba(14,12,30,0.98)');
  ctx.fillStyle = disc;
  ctx.beginPath(); ctx.arc(m, m, R, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = Math.max(1.5, R * (boss ? 0.09 : 0.06));
  ctx.strokeStyle = boss ? (on ? '#ffd34f' : 'rgba(200,180,120,0.4)') : on ? color : 'rgba(150,160,210,0.35)';
  ctx.stroke();
  ctx.lineWidth = Math.max(1, R * 0.025);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.arc(m, m, R * 0.86, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke(); // brillo del cristal
}

export function clearNodeSprites() { cache.clear(); }
