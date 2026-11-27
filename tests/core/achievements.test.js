import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ACHIEVEMENTS } from '../../src/achievements/registry.js';
import { TIERS } from '../../src/achievements/tiers.js';
import { checkAchievements } from '../../src/achievements/checkAchievements.js';
import { testGame } from '../helpers.js';

test('los logros tienen id único, nivel válido y prueba', () => {
  const ids = new Set();
  for (const a of ACHIEVEMENTS) {
    assert.ok(!ids.has(a.id), a.id); ids.add(a.id);
    assert.ok(TIERS[a.tier], a.id);
    assert.equal(typeof a.test, 'function');
    assert.ok(a.name && a.desc && a.on, a.id);
  }
  assert.ok(ACHIEVEMENTS.length >= 50, `hay ${ACHIEVEMENTS.length}`);
});

test('cuatro líneas desbloquean Primera luz y ¡Prisma!', () => {
  const { g } = testGame();
  const found = checkAchievements('score', { g, data: { lines: 4 }, profile: { lines: 4 } }, {});
  const ids = found.map((a) => a.id);
  assert.ok(ids.includes('first-line') && ids.includes('first-prism'));
});

test('un logro ya conseguido no se repite', () => {
  const { g } = testGame();
  const found = checkAchievements('score', { g, data: { lines: 1 }, profile: { lines: 1 } }, { 'first-line': 'hoy' });
  assert.ok(!found.some((a) => a.id === 'first-line'));
});
