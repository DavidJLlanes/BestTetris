import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectTSpin } from '../../src/core/rules/detectTSpin.js';
import { createBoard } from '../../src/core/board/createBoard.js';

test('una T girada con 3 esquinas ocupadas y las frontales llenas es giro-T completo', () => {
  const board = createBoard();
  const piece = { type: 'T', rot: 2, x: 3, y: 18 };
  board[18][3] = 'J'; board[20][3] = 'J'; board[20][5] = 'J';
  assert.equal(detectTSpin(board, piece, true, 0), 'full');
});

test('sin giro previo no hay giro-T', () => {
  const board = createBoard();
  board[18][3] = 'J'; board[20][3] = 'J'; board[20][5] = 'J';
  assert.equal(detectTSpin(board, { type: 'T', rot: 2, x: 3, y: 18 }, false, 0), null);
});
