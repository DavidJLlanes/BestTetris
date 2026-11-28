import { paintAstro } from './paintAstro.js';
import { paintDust } from './paintDust.js';
import { paintIce } from './paintIce.js';
import { paintHole } from './paintHole.js';
import { paintComet } from './paintComet.js';

/** Celdas especiales del Viaje con dibujo propio (el resto son gemas normales). */
export const COSMIC = {
  A: paintAstro,
  D: (ctx, x, y, s) => paintDust(ctx, x, y, s, false),
  d: (ctx, x, y, s) => paintDust(ctx, x, y, s, true),
  C: paintIce,
  H: paintHole,
  K: paintComet,
};
