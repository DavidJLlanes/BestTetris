import { startGame } from '../app/startGame.js';
import { getMode } from '../modes/registry.js';
import { makeReplayMode } from './makeReplayMode.js';

/** Reproduce una grabación en el tablero. */
export function playReplay(replay) {
  const base = getMode(replay.mode);
  if (base) startGame(makeReplayMode(replay, base));
}
