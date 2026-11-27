import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodePuzzle } from '../../src/puzzles/code/encodePuzzle.js';
import { decodePuzzle } from '../../src/puzzles/code/decodePuzzle.js';
import { validatePuzzle } from '../../src/puzzles/code/validatePuzzle.js';

const sample = { name: 'Pequeño reto ⚡', board: ['..........', 'GGGG..GGGG', 'GGGG..GGGG'], pieces: 'OT', goal: { type: 'lines', n: 2 }, hold: false };

test('un puzle sobrevive a codificar y decodificar', () => {
  const code = encodePuzzle(sample);
  assert.match(code, /^P1\.[A-Za-z0-9_-]+$/);
  const { puzzle, error } = decodePuzzle(code);
  assert.equal(error, undefined);
  assert.equal(puzzle.name, sample.name);
  assert.deepEqual(puzzle.board, sample.board.slice(1));
  assert.equal(puzzle.pieces, 'OT');
  assert.deepEqual(puzzle.goal, { type: 'lines', n: 2 });
  assert.equal(puzzle.hold, false);
});

test('el código se lee también dentro de un enlace', () => {
  const url = `https://ejemplo.es/tetris/?puzzle=${encodePuzzle(sample)}`;
  assert.equal(decodePuzzle(url).puzzle.pieces, 'OT');
});

test('los códigos dañados o manipulados se rechazan', () => {
  assert.ok(decodePuzzle('hola').error);
  assert.ok(decodePuzzle('P1.@@@').error);
  assert.ok(validatePuzzle({ ...sample, board: ['GGGGGGGGGG'] }));
  assert.ok(validatePuzzle({ ...sample, pieces: 'X' }));
  assert.ok(validatePuzzle({ ...sample, goal: { type: 'place' } }));
  assert.ok(validatePuzzle({ ...sample, name: '<b>' + 'x'.repeat(40) }));
  assert.equal(validatePuzzle(sample), null);
});

import { checkPuzzle } from '../../src/puzzles/solver/checkPuzzle.js';

test('el comprobador del editor distingue puzles posibles e imposibles', () => {
  assert.equal(checkPuzzle(sample), 'yes');
  assert.equal(checkPuzzle({ ...sample, pieces: 'I', goal: { type: 'lines', n: 2 } }), 'no');
  assert.equal(checkPuzzle({ ...sample, board: [], pieces: 'IIIIIIIIIIII', goal: { type: 'lines', n: 12 } }, 50), 'unknown');
});
