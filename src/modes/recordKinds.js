import { formatTime } from '../util/formatTime.js';
import { formatNumber } from '../util/formatNumber.js';

/**
 * Cómo se mide y se compara un récord según el tipo del modo.
 * won = la partida debe terminar con el objetivo cumplido para contar.
 */
export const RECORD_KINDS = {
  score: { value: (g) => g.score, better: (a, b) => a > b, format: (v) => formatNumber(v), won: false },
  time: { value: (g) => g.time, better: (a, b) => a < b, format: (v) => formatTime(v, true), won: true },
  lines: { value: (g) => g.lines, better: (a, b) => a > b, format: (v) => `${v} líneas`, won: false },
};
