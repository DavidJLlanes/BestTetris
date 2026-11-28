import { tickShooting } from '../elements/shooting.js';
import { holePull } from '../elements/holePull.js';
import { tickBoss } from '../boss/tickBoss.js';

const ACCEL = 0.985; // la gravedad se acelera un 1,5 % cada 2 s (si la regla está puesta)
const RUSH = 0.4, DARK = 0.12;

/**
 * Cada fotograma: elementos vivos (fugaces, atracción de los agujeros, jefe), la gravedad
 * (base × aceleración × prisa del jefe, o parada si hay un poder de congelar) y los poderes.
 */
export function tickLevel(g, dt, level) {
  const c = g.custom, s = level.spec;
  if (c.shoot) tickShooting(g, dt, s.shooting);
  holePull(g, dt);
  if (c.boss) tickBoss(g, dt, s.boss);
  if (c.accel) c.accel = Math.max(0.35, 1 * ACCEL ** Math.floor(g.time / 2));
  if (c.frozen > 0) { c.frozen -= dt; g.lockTimer = 0; if (c.frozen <= 0) g.emit('thaw', {}); }
  const rush = c.boss && c.boss.rush > 0 ? RUSH : 1;
  g.rules.fixedInterval = c.frozen > 0 ? 1e9 : c.base * (c.accel || 1) * rush;
  g.rules.stackAlpha = c.boss && c.boss.dark > 0 ? DARK : c.alpha;
  if (!c.power && c.bag.length && g.cur) { c.power = c.bag.shift(); g.emit('powerReady', { id: c.power }); }
}
