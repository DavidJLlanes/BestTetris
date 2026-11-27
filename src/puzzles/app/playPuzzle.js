import { startGame } from '../../app/startGame.js';
import { makePuzzleMode } from '../makePuzzleMode.js';

/** Empieza un puzle. quick salta la cuenta atrás (reintentos). */
export function playPuzzle(puzzle, opts) { startGame(makePuzzleMode(puzzle), opts); }
