import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testGame } from '../helpers.js';
import { spawn, tick, hardDrop } from '../../src/core/game/index.js';
import { usePower } from '../../src/modes/powers/usePower.js';
import { createPiece } from '../../src/core/pieces/createPiece.js';

test('Estaciones: cada 10 líneas llega la siguiente, con su regla', () => {
  const { g, events } = testGame('seasons');
  spawn(g);
  tick(g, 0.01);
  assert.equal(g.custom.season, 'spring');
  g.lines = 10; tick(g, 0.01);
  assert.equal(g.custom.season, 'summer');
  assert.ok(g.rules.fixedInterval < 0.5);
  g.lines = 30; tick(g, 0.01);
  assert.equal(g.custom.season, 'winter');
  assert.equal(g.rules.ghost, false);
  assert.equal(events.filter((e) => e.name === 'season').length, 3);
});

test('Estaciones: el otoño trae una fila de roca', () => {
  const { g } = testGame('seasons');
  spawn(g); tick(g, 0.01);
  g.lines = 20; tick(g, 0.01);
  assert.ok(g.board[g.board.length - 1].includes('G'));
});

test('Vaivén: avisa y cambia la gravedad por fases', () => {
  const { g, names } = testGame('sway');
  spawn(g);
  const calm = g.rules.fixedInterval;
  for (let i = 0; i < 130; i++) tick(g, 0.1);
  assert.ok(names().includes('swayWarn'));
  assert.ok(names().includes('swayPhase'));
  assert.ok(g.rules.fixedInterval < calm);
});

test('Caos: salen piezas especiales y la bomba vacía un 3×3', () => {
  const { g, names } = testGame('chaos');
  const types = new Set();
  for (let i = 0; i < 40; i++) types.add(g.hooks.nextPiece(g) || 'normal');
  assert.ok(['B', 'M', 'P'].some((t) => types.has(t)));
  for (let y = 16; y < 22; y++) g.board[y].fill('J');
  for (let y = 16; y < 22; y++) g.board[y][0] = null; // sin filas completas
  spawn(g);
  g.cur = createPiece('B');
  hardDrop(g);
  assert.ok(names().includes('bomb'));
  assert.equal(g.board[15][4], null);
  assert.equal(g.board[16][4], null);
  assert.equal(g.board[16][5], null);
});

test('Poderes: 4 líneas cargan un poder y usarlo lo gasta', () => {
  const { g, names } = testGame('powers');
  spawn(g);
  g.lines = 4; tick(g, 0.01);
  assert.equal(g.custom.power, 'freeze');
  assert.equal(usePower(g), true);
  assert.equal(g.custom.power, null);
  const before = g.cur.y;
  for (let i = 0; i < 20; i++) tick(g, 0.1); // congelada: no cae
  assert.equal(g.cur.y, before);
  for (let i = 0; i < 60; i++) tick(g, 0.1);
  assert.ok(names().includes('thaw'));
});

test('Poderes: la bomba de zona borra las dos filas de abajo', () => {
  const { g } = testGame('powers');
  spawn(g);
  for (let y = 18; y < 22; y++) g.board[y].fill('J');
  g.custom.power = 'zone';
  assert.equal(usePower(g), true);
  assert.equal(g.board.filter((r) => r.some(Boolean)).length, 2);
});
