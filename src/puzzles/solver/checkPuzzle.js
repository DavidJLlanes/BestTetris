import { createGame } from '../../core/game/createGame.js';
import { spawn } from '../../core/game/spawn.js';
import { makePuzzleMode } from '../makePuzzleMode.js';
import { solvable } from './solvable.js';

export const CHECK_BUDGET = 60000;

/** 'yes' si tiene solución sin reserva, 'no' si no la tiene, 'unknown' si es demasiado grande para comprobarlo. */
export function checkPuzzle(puzzle, budget = CHECK_BUDGET) {
  const g = createGame(makePuzzleMode(puzzle));
  spawn(g);
  try { return solvable(g, { left: budget }) ? 'yes' : 'no'; } catch (e) {
    if (e.message === 'budget') return 'unknown';
    throw e;
  }
}
