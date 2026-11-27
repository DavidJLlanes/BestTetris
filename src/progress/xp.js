/** Experiencia que da cada logro según su categoría. */
export const TIER_XP = { bronze: 50, silver: 150, gold: 400, prism: 1000 };

/**
 * Experiencia de una partida: líneas, puntos y tiempo jugado, con extra por completar el objetivo.
 * Deshacer la reduce a la mitad; ver repeticiones no da nada.
 */
export function gameXp(g) {
  if (g.hooks.spectate) return 0;
  if (g.hooks.puzzle) return g.won ? 60 : 5;
  const minutes = Math.min(g.time, 1800) / 60;
  let xp = g.lines * 8 + g.score / 250 + minutes * 10 + (g.won ? 150 : 0);
  if (g.stats.undos) xp /= 2;
  return Math.max(1, Math.round(xp));
}
