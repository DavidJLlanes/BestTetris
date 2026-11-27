import { test } from 'node:test';
import assert from 'node:assert/strict';
import { testGame } from '../helpers.js';
import { MODES } from '../../src/modes/registry.js';
import { spawn } from '../../src/core/game/spawn.js';
import { tick } from '../../src/core/game/tick.js';
import { hardDrop } from '../../src/core/game/hardDrop.js';
import { holdPiece } from '../../src/core/game/holdPiece.js';
import { countType } from '../../src/core/board/countType.js';

test('todos los modos tienen id, nombre y tipo de récord válidos', () => {
  const ids = new Set();
  for (const m of MODES) {
    assert.ok(m.id && m.name && ['score', 'time', 'lines'].includes(m.record), m.id);
    assert.ok(!ids.has(m.id)); ids.add(m.id);
  }
});

test('cada modo arranca y aguanta 300 piezas soltadas sin errores', () => {
  for (const m of MODES) {
    const { g } = testGame(m.id);
    spawn(g);
    for (let i = 0; i < 300 && !g.over; i++) { hardDrop(g); tick(g, 1); }
    assert.ok(g.stats.pieces > 0, m.id);
  }
});

test('ultra termina con victoria a los 2 minutos', () => {
  const { g } = testGame('ultra');
  spawn(g);
  g.time = 119.95;
  tick(g, 0.1);
  assert.equal(g.won, true);
});

test('excavación empieza con 10 filas de roca', () => {
  const { g } = testGame('dig');
  assert.equal(countType(g.board, 'G'), 90);
});

test('marea sube roca con el tiempo', () => {
  const { g, names } = testGame('tide');
  spawn(g);
  for (let i = 0; i < 120; i++) tick(g, 0.1);
  assert.ok(names().includes('garbage'));
});

test('purista no deja reservar', () => {
  const { g } = testGame('purist');
  spawn(g);
  assert.equal(holdPiece(g), false);
});

test('el desafío diario da la misma secuencia dos veces', () => {
  const m = MODES.find((x) => x.id === 'daily');
  const r1 = m.createRng(), r2 = m.createRng();
  assert.equal(r1(), r2());
});
