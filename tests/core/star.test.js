import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testGame, fillRows } from '../helpers.js';
import { spawn } from '../../src/core/game/spawn.js';
import { hardDrop } from '../../src/core/game/hardDrop.js';
import { tick } from '../../src/core/game/tick.js';
import { tryRotate } from '../../src/core/movement/tryRotate.js';
import { shiftToWall } from '../../src/core/movement/shiftToWall.js';
import { startStar } from '../../src/core/star/startStar.js';
import { starState } from '../../src/core/star/starState.js';
import { stackStarRows } from '../../src/core/star/stackStarRows.js';

const dropI = (g) => { spawn(g, 'I'); tryRotate(g, 1); shiftToWall(g, -1); hardDrop(g); };

test('las líneas llenan el medidor y con la mitad se puede activar', () => {
  const { g, names } = testGame();
  assert.equal(startStar(g), false, 'sin carga no se activa');
  fillRows(g.board, 18, 21, [0]);
  dropI(g);
  tick(g, 1);
  assert.equal(starState(g).charge, 0.45);
  starState(g).charge = 0.6;
  assert.equal(startStar(g), true);
  assert.ok(names().includes('starStart'));
  assert.equal(starState(g).charge, 0, 'el medidor se vacía al usarlo');
});

test('durante el momento estelar la pieza no cae sola', () => {
  const { g } = testGame();
  starState(g).charge = 1;
  spawn(g);
  startStar(g);
  const y = g.cur.y;
  for (let i = 0; i < 20; i++) tick(g, 0.1);
  assert.equal(g.cur.y, y);
});

test('las filas se acumulan abajo y estallan todas juntas al final con puntos extra', () => {
  const { g, names } = testGame();
  starState(g).charge = 1;
  spawn(g);
  startStar(g);
  fillRows(g.board, 20, 21, [0]);
  g.cur = null;
  dropI(g); // completa 2 filas: se apilan, no se borran
  assert.equal(starState(g).stacked, 2);
  assert.equal(g.clearing, null);
  assert.equal(g.lines, 0);
  assert.ok(g.board[21].every(Boolean) && g.board[20].every(Boolean));
  // se acaba el tiempo y se fija otra pieza: estalla todo
  starState(g).time = 0.01;
  tick(g, 0.05);
  const before = g.score;
  hardDrop(g);
  assert.deepEqual(g.clearing.rows, [20, 21]);
  assert.equal(g.lines, 2);
  assert.ok(g.score > before);
  assert.ok(names().includes('starEnd'));
  tick(g, 1);
  assert.equal(starState(g).active, false);
});

test('apilar filas estelares conserva el alto y las pone sobre las anteriores', () => {
  const row = (c) => Array(10).fill(c), empty = () => Array(10).fill(null);
  const board = [empty(), row('A'), empty(), row('S')]; // 1 estelar abajo (S); fila 1 completa nueva
  const next = stackStarRows(board, [1], 1);
  assert.equal(next.length, 4);
  assert.deepEqual(next.map((r) => r[0]), [null, null, 'A', 'S']);
});

test('los modos sin momento estelar no cargan medidor', () => {
  const { g } = testGame('sprint');
  fillRows(g.board, 18, 21, [0]);
  dropI(g);
  assert.equal(g.custom.star, undefined);
});
