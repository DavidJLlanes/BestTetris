import { deepMax } from './deepMax.js';

/** Estadísticas: cada contador se queda con el valor mayor; en puzles, el mejor tiempo (el menor). */
export function mergeProfile(a, b) {
  const out = deepMax(a, b);
  if (a && b && a.puzzles && b.puzzles) {
    out.puzzles = { ...a.puzzles, ...b.puzzles };
    for (const k of Object.keys(a.puzzles)) if (k in b.puzzles) out.puzzles[k] = Math.min(a.puzzles[k], b.puzzles[k]);
  }
  return out;
}
