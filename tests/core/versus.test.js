import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attackFor, cancelPending } from '../../src/versus/attackFor.js';

test('ataque según la jugada', () => {
  assert.equal(attackFor({ lines: 1 }), 0);
  assert.equal(attackFor({ lines: 2 }), 1);
  assert.equal(attackFor({ lines: 4 }), 4);
  assert.equal(attackFor({ lines: 4, backToBack: true }), 5);
  assert.equal(attackFor({ lines: 2, tspin: 'full' }), 4);
  assert.equal(attackFor({ lines: 1, comboCount: 4 }), 2);
  assert.equal(attackFor({ lines: 0, tspin: 'full' }), 0);
});

test('la basura que te llega se cancela con la que envías', () => {
  const p = { pending: 3 };
  assert.equal(cancelPending(p, 2), 0);
  assert.equal(p.pending, 1);
  assert.equal(cancelPending(p, 4), 3);
  assert.equal(p.pending, 0);
});
