import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextStop } from '../../src/journey/progress/nextStop.js';
import { getLevel } from '../../src/journey/catalog.js';
import { mergeJourney } from '../../src/sync/merge/rules/mergeJourney.js';

const progress = (levels) => ({ levels, earned: 0, spent: 0, bought: {}, used: {}, events: {}, seen: {} });

test('tras ganar, la nave va a la parada siguiente aunque ya estuviera abierta', () => {
  const p = progress({ 'osa-menor': { stars: 2 }, casiopea: { stars: 3 } });
  assert.equal(nextStop(getLevel('casiopea'), p), 'cefeo');
});

test('no hay viaje si la parada siguiente sigue cerrada', () => {
  assert.equal(nextStop(getLevel('casiopea'), progress({})), null);
});

test('el viaje por celebrar no se mezcla entre dispositivos', () => {
  const m = mergeJourney({ levels: {}, pending: null }, { levels: {}, pending: { id: 'casiopea' } });
  assert.equal(m.pending, null);
});
