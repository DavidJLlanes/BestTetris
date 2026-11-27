/** Colecciones de puzles. Añade una colección en ./sets/ y regístrala aquí. */
import basics from './sets/basics.js';
import tspin from './sets/tspin.js';
import trainer from './sets/trainer.js';

export const PUZZLE_SETS = [basics, tspin, trainer];
export const ALL_PUZZLES = PUZZLE_SETS.flatMap((s) => s.puzzles.map((p) => ({ ...p, set: s.id })));
export const getPuzzle = (id) => ALL_PUZZLES.find((p) => p.id === id);
