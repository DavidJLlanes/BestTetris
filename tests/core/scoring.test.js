import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreClear } from '../../src/core/rules/scoreClear.js';

test('cuatro líneas a nivel 1 valen 800', () => {
  assert.equal(scoreClear({ lines: 4, tspin: null, level: 1, combo: -1, b2b: false }).points, 800);
});

test('back-to-back multiplica por 1,5', () => {
  const r = scoreClear({ lines: 4, tspin: null, level: 2, combo: -1, b2b: true });
  assert.equal(r.points, 2400);
  assert.match(r.label, /^B2B/);
});

test('el combo suma 50 × combo × nivel', () => {
  const r = scoreClear({ lines: 1, tspin: null, level: 1, combo: 1, b2b: false });
  assert.equal(r.points, 100 + 100);
  assert.equal(r.combo, 2);
});

test('una línea sencilla rompe el back-to-back', () => {
  assert.equal(scoreClear({ lines: 1, tspin: null, level: 1, combo: -1, b2b: true }).b2b, false);
});

test('no limpiar reinicia el combo', () => {
  assert.equal(scoreClear({ lines: 0, tspin: null, level: 1, combo: 3, b2b: false }).combo, -1);
});
