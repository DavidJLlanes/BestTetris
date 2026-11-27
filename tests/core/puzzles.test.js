import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_PUZZLES } from '../../src/puzzles/registry.js';
import { makePuzzleMode } from '../../src/puzzles/makePuzzleMode.js';
import { createGame } from '../../src/core/game/createGame.js';
import { spawn } from '../../src/core/game/spawn.js';
import { solvable } from '../helpers/solver.js';

for (const puzzle of ALL_PUZZLES) {
  if (puzzle.targets) continue;
  test(`el puzle ${puzzle.id} (${puzzle.name}) tiene solución`, () => {
    const g = createGame(makePuzzleMode(puzzle));
    spawn(g);
    assert.equal(solvable(g), true);
  });
}

import { lockPiece } from '../../src/core/game/lockPiece.js';
import { finishClear } from '../../src/core/game/finishClear.js';
import { pieceCells } from '../../src/core/pieces/pieceCells.js';
import { placements } from '../helpers/solver.js';

const samePlace = (s, goal) => {
  const cells = pieceCells(s.cur);
  return cells.length === goal.length && cells.every(([x, y]) => goal.some(([u, v]) => u === x && v === y));
};

for (const puzzle of ALL_PUZZLES.filter((p) => p.targets)) {
  test(`el entrenamiento ${puzzle.id} (${puzzle.name}) se completa siguiendo las siluetas`, () => {
    let g = createGame(makePuzzleMode(puzzle));
    spawn(g);
    while (!g.over) {
      const goal = g.hooks.target(g);
      const reach = placements(g).find((s) => samePlace(s, goal));
      assert.ok(reach, `la silueta ${g.custom.placed + 1} es alcanzable`);
      g = reach;
      lockPiece(g, false);
      if (g.clearing) finishClear(g);
    }
    assert.equal(g.won, true);
  });
}
