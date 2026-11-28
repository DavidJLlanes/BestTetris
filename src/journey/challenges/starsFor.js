import { CHALLENGES } from './list.js';

/** Estrellas de una partida: 0 si no se ganó; si no, 1 más un punto por reto cumplido. */
export function starsFor(g, level) {
  if (!g.won) return 0;
  return 1 + level.challenges.filter((c) => CHALLENGES[c.type].test(g, c)).length;
}
