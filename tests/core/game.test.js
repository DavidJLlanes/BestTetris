import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testGame, fillRows } from '../helpers.js';
import { spawn } from '../../src/core/game/spawn.js';
import { hardDrop } from '../../src/core/game/hardDrop.js';
import { holdPiece } from '../../src/core/game/holdPiece.js';
import { tick } from '../../src/core/game/tick.js';
import { tryRotate } from '../../src/core/movement/tryRotate.js';
import { shiftToWall } from '../../src/core/movement/shiftToWall.js';

test('una I vertical en el hueco limpia 4 líneas', () => {
  const { g, names } = testGame();
  fillRows(g.board, 18, 21, [0]);
  spawn(g, 'I');
  tryRotate(g, 1);
  shiftToWall(g, -1);
  hardDrop(g);
  assert.deepEqual(g.clearing.rows, [18, 19, 20, 21]);
  tick(g, 1);
  assert.equal(g.lines, 4);
  assert.ok(names().includes('perfectClear'));
  assert.ok(g.cur, 'aparece la siguiente pieza');
});

test('la reserva solo se puede usar una vez por pieza', () => {
  const { g } = testGame();
  spawn(g);
  const first = g.cur.type;
  assert.equal(holdPiece(g), true);
  assert.equal(g.hold, first);
  assert.equal(holdPiece(g), false);
});

test('la gravedad bloquea la pieza tras el retardo', () => {
  const { g } = testGame();
  spawn(g);
  for (let i = 0; i < 400 && g.stats.pieces === 0; i++) tick(g, 0.05);
  assert.equal(g.stats.pieces, 1);
});

test('llenar el tablero termina la partida en maratón', () => {
  const { g, names } = testGame();
  fillRows(g.board, 2, 21, [5]);
  spawn(g);
  for (let i = 0; i < 50 && !g.over; i++) hardDrop(g);
  assert.equal(g.over, true);
  assert.ok(names().includes('finish'));
});

test('en zen el tablero se vacía y se sigue jugando', () => {
  const { g, names } = testGame('zen');
  fillRows(g.board, 2, 21, [5]);
  spawn(g);
  for (let i = 0; i < 5 && !names().includes('boardReset'); i++) hardDrop(g);
  assert.equal(g.over, false);
  assert.ok(names().includes('boardReset'));
});

test('sprint termina al llegar a 40 líneas', () => {
  const { g } = testGame('sprint');
  g.lines = 36;
  fillRows(g.board, 18, 21, [0]);
  spawn(g, 'I');
  tryRotate(g, 1);
  shiftToWall(g, -1);
  hardDrop(g);
  tick(g, 1);
  assert.equal(g.over, true);
  assert.equal(g.won, true);
});
