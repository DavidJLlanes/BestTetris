import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBag } from '../../src/core/randomizer/createBag.js';
import { TYPES } from '../../src/config/shapes.js';

test('cada tanda de 7 contiene todas las piezas una vez', () => {
  const next = createBag();
  for (let round = 0; round < 20; round++) {
    const set = new Set(Array.from({ length: 7 }, next));
    assert.deepEqual([...set].sort(), TYPES.slice().sort());
  }
});
