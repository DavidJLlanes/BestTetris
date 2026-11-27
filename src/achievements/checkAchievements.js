import { ACHIEVEMENTS } from './registry.js';

/**
 * Devuelve los logros aún no conseguidos que se cumplen tras el evento `event`.
 * Función pura: no guarda nada.
 */
export function checkAchievements(event, ctx, unlocked) {
  return ACHIEVEMENTS.filter((a) => {
    if (unlocked[a.id]) return false;
    const triggers = Array.isArray(a.on) ? a.on : [a.on];
    if (!triggers.includes(event)) return false;
    try { return !!a.test(ctx); } catch { return false; }
  });
}
