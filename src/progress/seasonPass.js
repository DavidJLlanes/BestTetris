/** Temporadas: una por mes. Cada una tiene su experiencia y 10 escalones con medalla final. */
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const SEASON_STEP_XP = 600;
export const SEASON_STEPS = 10;

export const seasonKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

export function seasonName(key) {
  const [y, m] = key.split('-').map(Number);
  return `Temporada de ${MONTHS[m - 1]} ${y}`;
}

/** Escalón alcanzado (0..10) y avance hacia el siguiente. */
export function seasonStep(xp) {
  const step = Math.min(SEASON_STEPS, Math.floor(xp / SEASON_STEP_XP));
  return { step, frac: step >= SEASON_STEPS ? 1 : (xp % SEASON_STEP_XP) / SEASON_STEP_XP };
}
