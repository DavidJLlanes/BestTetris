import { drawShooting } from './drawShooting.js';
import { drawHoles } from './drawHoles.js';
import { drawBossBar } from './drawBossBar.js';

/** Capa del Viaje sobre los bloques: estrella fugaz, remolinos de los agujeros negros y vida del jefe. */
export function drawCosmic(ctx, g, now) {
  const c = g.custom;
  if (c.shoot && c.shoot.y !== null) drawShooting(ctx, c.shoot, now);
  if (c.holePull || c.j.start.holes) drawHoles(ctx, g, now);
  if (c.boss) drawBossBar(ctx, c.boss, g.hooks.level.sky.name, now);
}
