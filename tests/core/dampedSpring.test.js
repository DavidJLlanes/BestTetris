import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dampedSpring as spring } from '../../src/util/dampedSpring.js';

const run = (stiffness, ratio, frames, dt = 1 / 60) => {
  let v = -1, vel = 0, min = v, max = v, settled = null;
  for (let i = 0; i < frames; i++) {
    [v, vel] = spring(v, vel, stiffness, ratio, dt);
    min = Math.min(min, v); max = Math.max(max, v);
    if (settled === null && Math.abs(v) < 0.02 && Math.abs(vel) < 0.5) settled = (i + 1) * dt;
  }
  return { v, max, settled };
};

test('el giro rebota un poco (5-20 %) y se asienta en unos 200 ms', () => {
  const r = run(1000, 0.55, 60);
  assert.ok(r.max > 0.05 && r.max < 0.2, `rebote ${r.max}`);
  assert.ok(r.settled < 0.32, `asentado en ${r.settled}`);
  assert.equal(r.v, 0);
});

test('el muelle es estable a 30 y a 144 fps', () => {
  for (const dt of [1 / 30, 1 / 144]) {
    const r = run(1500, 0.3, Math.round(1 / dt));
    assert.ok(Math.abs(r.v) < 0.01);
  }
});
