import { ATTACKS } from './attacks.js';

/**
 * El jefe ataca cada `every` segundos con sus ataques en orden y avisa un segundo antes.
 * Estado en g.custom.boss = { hp, max, t, i, dark, rush, flash, warned }.
 */
export function tickBoss(g, dt, spec) {
  const b = g.custom.boss;
  if (!b || b.hp <= 0) return;
  b.t += dt;
  b.dark = Math.max(0, b.dark - dt);
  b.rush = Math.max(0, b.rush - dt);
  b.flash = Math.max(0, b.flash - dt * 2.5);
  const kind = spec.attacks[b.i % spec.attacks.length];
  if (!b.warned && b.t >= spec.every - 1.2) { b.warned = true; g.emit('bossWarn', { kind, attack: ATTACKS[kind] }); }
  if (b.t < spec.every || g.clearing) return;
  b.t = 0; b.i++; b.warned = false;
  if (ATTACKS[kind].run(g)) g.emit('bossAttack', { kind, attack: ATTACKS[kind] });
}
