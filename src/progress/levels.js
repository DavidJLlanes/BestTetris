/** Experiencia acumulada que hace falta para llegar al nivel n (el nivel 1 empieza en 0). */
export const xpForLevel = (n) => Math.round(120 * Math.pow(n - 1, 1.6));

/** Nivel del jugador para una experiencia dada, y cuánto lleva del siguiente (0..1). */
export function levelFromXp(xp) {
  let n = 1;
  while (xpForLevel(n + 1) <= xp) n++;
  const from = xpForLevel(n), to = xpForLevel(n + 1);
  return { level: n, into: xp - from, need: to - from, frac: (xp - from) / (to - from) };
}
