import { ACHIEVEMENTS } from './registry.js';

const ASSISTED_OFF = ['scoring', 'modes', 'secrets'];

/**
 * Devuelve los logros aún no conseguidos que se cumplen tras el evento `event`.
 * Función pura: no guarda nada.
 */
export function checkAchievements(event, ctx, unlocked) {
  return ACHIEVEMENTS.filter((a) => {
    if (unlocked[a.id]) return false;
    // Algunos modos (puzles) solo cuentan para su propia categoría: sus tableros lo pondrían demasiado fácil
    const only = ctx.g && ctx.g.hooks && ctx.g.hooks.achievementCategory;
    if (only && a.category !== only) return false;
    // Tras deshacer, los logros de puntuación y de modos no cuentan (las líneas y la técnica sí)
    if (ctx.g && ctx.g.stats && ctx.g.stats.undos && ASSISTED_OFF.includes(a.category)) return false;
    const triggers = Array.isArray(a.on) ? a.on : [a.on];
    if (!triggers.includes(event)) return false;
    try { return !!a.test(ctx); } catch { return false; }
  });
}
