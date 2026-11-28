import { map } from './mapState.js';
import { project } from './project.js';
import { aimAt } from './camera.js';
import { burst } from './particles.js';
import { playSfx } from '../../audio/index.js';
import { vibrate } from '../../input/haptics.js';
import { drawConstellation } from '../art/drawConstellation.js';
import { TRAMOS } from '../tramos.js';
import { MAIN } from '../catalog.js';
import { startTravel } from './ship/startTravel.js';
import { shipPos } from './shipPos.js';

const P = {};
const GOLD = ['#ffd34f', '#fff3c4', '#ffffff', '#ff9bea'];

/**
 * Al volver al mapa tras ganar: la constelación se dibuja trazo a trazo, estalla en luz, caen
 * sus estrellas una a una y la nave viaja hasta la siguiente parada, que se abre con un rebote.
 * r: resumen de recordResult · next: id de la parada que se abre (o null) · lit: luz del camino nueva.
 */
export function startCelebration(r, next, lit, unlock = true) {
  const draw = r.firstWin && r.level.kind !== 'event';
  map.celebrate = { id: r.level.id, t: draw ? 0 : 1.9, draw, hideLit: draw, stars: r.stars, prev: r.prev, next, lit, fired: new Set(), litFrom: map.lit, unlock };
  map.sel = r.level.id;
  aimAt(map.byId[r.level.id]);
}

const once = (c, key) => !c.fired.has(key) && c.fired.add(key);

export function updateCelebration(dt) {
  const c = map.celebrate;
  if (!c) return;
  c.t += dt;
  const node = map.byId[c.id];
  project(node.x, node.y, P);
  const sky = node.level.sky;
  if (c.draw && c.t > 0.6 && c.t < 2.2) {
    const k = Math.floor(((c.t - 0.6) / 1.6) * sky.stars.length);
    if (once(c, `s${k}`) && k < sky.stars.length) playSfx('jStar', { i: k });
  }
  if (c.draw && c.t >= 2.2 && once(c, 'burst')) {
    c.hideLit = false;
    burst(P.x, P.y, 70, GOLD, 320, 3);
    playSfx('jConstellation');
    vibrate([18, 40, 18]);
  }
  for (let i = c.prev; i < c.stars; i++) {
    const at = 2.4 + (i - c.prev) * 0.32;
    if (c.t >= at && once(c, `star${i}`)) {
      const sr = Math.max(4.5, node.r * P.s * 0.2);
      burst(P.x + (i - 1) * sr * 2.3, P.y + node.r * P.s + sr * 1.5, 16, GOLD, 140, 2);
      playSfx('jReward', { i });
    }
  }
  const travel = 3.4;
  if (c.next && c.t >= travel && once(c, 'travel')) {
    startTravel(c.id, c.next);
    playSfx('jShip');
  }
  if (c.t >= travel) map.lit = c.litFrom + (c.lit - c.litFrom) * (c.next ? shipPos().progress : Math.min(1, (c.t - travel) / 1.1));
  const arrived = !c.next || (map.ship.id === c.next && map.ship.t >= 0.8);
  if (c.next && c.t >= travel && arrived && once(c, 'open')) {
    map.sel = c.next;
    aimAt(map.byId[c.next]);
    if (c.unlock) { // parada recién abierta: rebote, destello y sonido
      map.pops[c.next] = 0.001;
      const n = map.byId[c.next];
      project(n.x, n.y, P);
      burst(P.x, P.y, 30, [TRAMOS[n.tramo].nebula[0], '#fff'], 200, 2.4);
      playSfx('jUnlock');
    }
  }
  if ((c.next && c.fired.has('open') && map.ship.t >= 1 && c.t > travel + 1.4) || (!c.next && c.t > 3.4)) { map.lit = c.lit; map.celebrate = null; }
}

/** Mientras se celebra: la constelación grande dibujándose sobre su parada. */
export function drawCelebration(ctx) {
  const c = map.celebrate;
  if (!c || !c.draw || c.t > 3.2) return;
  const node = map.byId[c.id];
  project(node.x, node.y, P);
  const k = Math.max(0, Math.min(1, (c.t - 0.6) / 1.6));
  const fade = c.t < 2.2 ? Math.min(1, c.t / 0.4) : Math.max(0, 1 - (c.t - 2.2) / 1);
  const grow = c.t < 2.2 ? 1 : 1 + (c.t - 2.2) * 0.5;
  const color = TRAMOS[node.tramo].nebula[0];
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  drawConstellation(ctx, node.level.sky, P.x, P.y, node.r * P.s * 1.45 * grow * 1.6, { lines: k, stars: Math.min(1, k * 1.3), lit: true, color, alpha: fade });
  if (c.t >= 2.2) {
    const ring = (c.t - 2.2) / 0.8;
    ctx.globalAlpha = Math.max(0, 1 - ring);
    ctx.strokeStyle = '#fff3c4';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(P.x, P.y, node.r * P.s * (1 + ring * 2.5), 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

/** Luz del camino: hasta la primera parada abierta sin ganar (índice en el camino). */
export function litIndex(frontierId) {
  const i = MAIN.findIndex((l) => l.id === frontierId);
  return Math.max(0, i);
}
