import { CHORDS, STEPS_PER_BAR, BARS } from './score.js';

/**
 * Armonía que suena en un paso de la canción: el acorde (ya transportado) y una escalera de
 * notas del acorde en varias octavas. Las jugadas eligen sus notas de esa escalera, así que
 * siempre suenan afinadas con la música.
 */
export function harmonyAt(step, transpose = 0) {
  const bar = Math.floor(step / STEPS_PER_BAR) % BARS;
  const chord = CHORDS[bar].map((n) => n + transpose);
  const ladder = [];
  for (const oct of [0, 12, 24, 36]) for (const n of chord) ladder.push(n + oct);
  return { bar, chord, ladder };
}
