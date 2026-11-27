import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROTATIONS } from '../../src/core/pieces/rotations.js';
import { TYPES } from '../../src/config/shapes.js';
import { collides } from '../../src/core/pieces/collides.js';
import { createBoard } from '../../src/core/board/createBoard.js';
import { createPiece } from '../../src/core/pieces/createPiece.js';

test('las 7 piezas normales tienen 4 celdas en los 4 giros', () => {
  for (const t of TYPES) for (const cells of ROTATIONS[t]) assert.equal(cells.length, 4);
});

test('las piezas especiales conservan sus bloques al girar', () => {
  for (const [t, n] of [['M', 1], ['B', 1], ['P', 5]]) for (const cells of ROTATIONS[t]) assert.equal(cells.length, n);
});

test('las paredes y el suelo bloquean', () => {
  const board = createBoard();
  const p = createPiece('I');
  assert.equal(collides(board, p), false);
  assert.equal(collides(board, p, 0, -1), true);
  assert.equal(collides(board, p, 0, 7), true);
  assert.equal(collides(board, p, 0, 0, 21), true);
});
