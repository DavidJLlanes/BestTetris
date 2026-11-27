import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROTATIONS } from '../../src/core/pieces/rotations.js';
import { collides } from '../../src/core/pieces/collides.js';
import { createBoard } from '../../src/core/board/createBoard.js';
import { createPiece } from '../../src/core/pieces/createPiece.js';

test('todas las piezas tienen 4 celdas en los 4 giros', () => {
  for (const states of Object.values(ROTATIONS)) for (const cells of states) assert.equal(cells.length, 4);
});

test('las paredes y el suelo bloquean', () => {
  const board = createBoard();
  const p = createPiece('I');
  assert.equal(collides(board, p), false);
  assert.equal(collides(board, p, 0, -1), true);
  assert.equal(collides(board, p, 0, 7), true);
  assert.equal(collides(board, p, 0, 0, 21), true);
});
