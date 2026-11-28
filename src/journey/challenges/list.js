import { formatTime } from '../../util/formatTime.js';
import { formatNumber } from '../../util/formatNumber.js';

/**
 * Retos de estrella: cada constelación tiene dos. Con el objetivo cumplido das 1 estrella;
 * cada reto superado suma otra (máximo 3). Se comprueban al terminar.
 */
export const CHALLENGES = {
  score: { text: (c) => `${formatNumber(c.n)} puntos o más`, test: (g, c) => g.score >= c.n },
  time: { text: (c) => `En menos de ${formatTime(c.n)}`, test: (g, c) => g.time < c.n },
  noUndo: { text: () => 'Sin deshacer', test: (g) => !g.stats.undos },
  noHold: { text: () => 'Sin usar la reserva', test: (g) => !g.stats.holds },
  quads: { text: (c) => `${c.n} ${c.n === 1 ? 'prisma' : 'prismas'} (4 líneas)`, test: (g, c) => g.stats.quads >= c.n },
  combo: { text: (c) => `Un combo de ${c.n}`, test: (g, c) => g.stats.maxCombo >= c.n },
  tspin: { text: (c) => `${c.n} ${c.n === 1 ? 'giro-T' : 'giros-T'}`, test: (g, c) => g.stats.tspins >= c.n },
  pieces: { text: (c) => `Con ${c.n} piezas o menos`, test: (g, c) => g.stats.pieces <= c.n },
  lines: { text: (c) => `${c.n} líneas o más`, test: (g, c) => g.lines >= c.n },
  perfect: { text: () => 'Dejar el tablero vacío una vez', test: (g) => g.stats.perfectClears > 0 },
  noBooster: { text: () => 'Sin usar poderes', test: (g) => !g.stats.powers },
  shooting: { text: (c) => `${c.n} estrellas fugaces`, test: (g, c) => !!g.custom.j && g.custom.j.shooting >= c.n },
};

export const challengeText = (c) => CHALLENGES[c.type].text(c);
