import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slowMotion, timeScale } from '../../src/effects/slowMotion.js';
import { updateEffects } from '../../src/effects/updateEffects.js';
import { STEPS } from '../../src/tutorial/steps.js';
import { createBoard } from '../../src/core/board/createBoard.js';

test('la cámara lenta empieza lenta y vuelve a velocidad normal', () => {
  slowMotion(0.5, 0.25);
  assert.ok(Math.abs(timeScale() - 0.25) < 1e-9);
  for (let i = 0; i < 40; i++) updateEffects(0.02);
  assert.equal(timeScale(), 1);
});

test('el paso de limpiar fila deja un hueco de 4 en la última fila', () => {
  const g = { board: createBoard() };
  const step = STEPS.find((s) => s.id === 'clear');
  step.setup(g);
  assert.equal(step.piece, 'I');
  assert.equal(g.board.at(-1).filter((c) => !c).length, 4);
});

test('todos los pasos del tutorial tienen texto para teclado, mando y táctil', () => {
  for (const s of STEPS) for (const k of ['keys', 'pad', 'touch']) assert.ok(s.text[k], `${s.id}.${k}`);
});
