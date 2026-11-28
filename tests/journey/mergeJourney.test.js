import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeJourney } from '../../src/sync/merge/rules/mergeJourney.js';

test('al sincronizar el Viaje no se pierde ninguna estrella ni polvo', () => {
  const local = { levels: { orion: { stars: 1, best: 9000 } }, earned: 300, spent: 50, fuel: { n: 2 }, calm: true, at: 'orion' };
  const remote = { levels: { orion: { stars: 3, best: 4000 }, lira: { stars: 2 } }, earned: 500, spent: 40, fuel: { n: 5 }, calm: false, at: 'lira' };
  const m = mergeJourney(local, remote);
  assert.equal(m.levels.orion.stars, 3);
  assert.equal(m.levels.orion.best, 9000);
  assert.equal(m.levels.lira.stars, 2);
  assert.equal(m.earned, 500);
  assert.deepEqual(m.fuel, { n: 2 });
  assert.equal(m.calm, true);
  assert.equal(m.at, 'orion');
});
