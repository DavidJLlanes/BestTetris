import { PUZZLE_SETS } from '../registry.js';

/** Texto corto de dónde está el puzle: "Giros-T · 2/4" o "Puzle compartido". */
export function puzzleLabel(puzzle) {
  const set = PUZZLE_SETS.find((s) => s.id === puzzle.set);
  if (!set) return puzzle.custom ? 'Puzle creado' : 'Puzle';
  return `${set.name} · ${set.puzzles.findIndex((p) => p.id === puzzle.id) + 1}/${set.puzzles.length}`;
}
