import { ALL_PUZZLES } from './registry.js';

/** El puzle que va después de este en el orden de las colecciones, o null. */
export function nextPuzzle(puzzle) {
  if (!puzzle || !puzzle.set) return null;
  const i = ALL_PUZZLES.findIndex((p) => p.id === puzzle.id);
  return ALL_PUZZLES[i + 1] || null;
}
