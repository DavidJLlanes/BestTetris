const PER_NEW_STAR = 30;
const PER_WIN = 10;
const SCORE_STEP = 2500;

/**
 * Polvo estelar de una partida ganada: un poco por ganar, bastante por cada estrella nueva y
 * algo por los puntos. Los jefes dan el doble y la lluvia de estrellas también.
 */
export function rewardFor(level, stars, prevStars, score) {
  if (!stars) return 0;
  const fresh = Math.max(0, stars - prevStars);
  const base = PER_WIN + fresh * PER_NEW_STAR + Math.floor(score / SCORE_STEP);
  return level.kind === 'boss' || level.kind === 'event' ? base * 2 : base;
}
