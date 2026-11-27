import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xpForLevel, levelFromXp } from '../../src/progress/levels.js';
import { rankFor } from '../../src/progress/ranks.js';
import { streak } from '../../src/progress/streak.js';
import { dateKey } from '../../src/progress/dateKey.js';
import { seasonStep, seasonName } from '../../src/progress/seasonPass.js';
import { gameXp } from '../../src/progress/xp.js';

test('los niveles crecen y cada vez cuestan más', () => {
  assert.equal(levelFromXp(0).level, 1);
  assert.equal(levelFromXp(xpForLevel(5)).level, 5);
  assert.equal(levelFromXp(xpForLevel(5) - 1).level, 4);
  assert.ok(xpForLevel(11) - xpForLevel(10) > xpForLevel(3) - xpForLevel(2));
  const l = levelFromXp(xpForLevel(3) + 10);
  assert.ok(l.frac > 0 && l.frac < 1);
});

test('el rango depende del nivel', () => {
  assert.equal(rankFor(1).name, 'Chispa');
  assert.equal(rankFor(12).name, 'Gema');
  assert.equal(rankFor(99).name, 'Leyenda');
});

test('la racha cuenta días seguidos y no se rompe si hoy aún no has jugado', () => {
  const today = new Date(2026, 10, 27, 15);
  const d = (n) => dateKey(new Date(2026, 10, 27 + n, 12));
  const days = { [d(-1)]: {}, [d(-2)]: {}, [d(-3)]: {}, [d(-6)]: {}, [d(-7)]: {} };
  assert.deepEqual(streak(days, today), { current: 3, best: 3, playedToday: false });
  days[d(0)] = {};
  assert.equal(streak(days, today).current, 4);
  assert.equal(streak({ [d(-2)]: {} }, today).current, 0);
});

test('temporadas mensuales con escalones', () => {
  assert.equal(seasonName('2026-11'), 'Temporada de noviembre 2026');
  assert.equal(seasonStep(0).step, 0);
  assert.equal(seasonStep(1300).step, 2);
  assert.equal(seasonStep(1e9).step, 10);
});

test('la experiencia de partida premia jugar y se reduce al deshacer', () => {
  const g = { hooks: {}, lines: 40, score: 10000, time: 120, won: true, stats: { undos: 0 } };
  const full = gameXp(g);
  assert.ok(full > 400);
  assert.equal(gameXp({ ...g, stats: { undos: 2 } }), Math.round(full / 2));
  assert.equal(gameXp({ ...g, hooks: { spectate: true } }), 0);
});
