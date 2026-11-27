import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeData } from '../../src/sync/merge/mergeData.js';
import { RULES } from '../../src/sync/merge/rulesByKey.js';
import { SAVE_KEYS } from '../../src/storage/keys.js';
import { stableJson } from '../../src/util/stableJson.js';

const rec = (value, score = value) => ({ value, score, lines: 1, level: 1, time: 10, date: '1/1/2026' });

test('cada clave guardada tiene su regla de fusión', () => assert.deepEqual(Object.keys(RULES).sort(), [...SAVE_KEYS].sort()));

test('las estadísticas se quedan con el máximo y los puzles con el mejor tiempo', () => {
  const a = { profile: { games: 10, lines: 50, modesPlayed: { marathon: 4 }, puzzles: { p1: 30, p2: 10 }, seasonXp: { '2026-11': 100 } } };
  const b = { profile: { games: 7, lines: 80, modesPlayed: { marathon: 2, sprint: 3 }, puzzles: { p1: 20 }, seasonXp: { '2026-10': 40 } } };
  const p = mergeData(a, b).profile;
  assert.equal(p.games, 10); assert.equal(p.lines, 80);
  assert.deepEqual(p.modesPlayed, { marathon: 4, sprint: 3 });
  assert.deepEqual(p.puzzles, { p1: 20, p2: 10 });
  assert.deepEqual(p.seasonXp, { '2026-11': 100, '2026-10': 40 });
});

test('los récords se juntan sin repetir y quedan los 5 mejores, en su orden', () => {
  const a = { records: { marathon: [rec(900), rec(500), rec(100)], sprint: [rec(50)] } };
  const b = { records: { marathon: [rec(900), rec(700), rec(300), rec(200)], sprint: [rec(40), rec(60)] } };
  const r = mergeData(a, b).records;
  assert.deepEqual(r.marathon.map((e) => e.value), [900, 700, 500, 300, 200]);
  assert.deepEqual(r.sprint.map((e) => e.value), [40, 50, 60]); // en tiempo, menos es mejor
});

test('la repetición que queda es la del lado con mejor marca', () => {
  const a = { records: { marathon: [rec(500)] }, replays: { marathon: 'A' } };
  const b = { records: { marathon: [rec(900)] }, replays: { marathon: 'B', 'daily-1': 'x', 'daily-2': 'y' } };
  assert.deepEqual(mergeData(a, b).replays, { marathon: 'B', 'daily-2': 'y' });
});

test('logros, días e historial se juntan sin perder nada', () => {
  const a = { achievements: { a1: '1/1' }, days: { d1: { g: 2, l: 10, xp: 5 } }, history: [[1, 'm', 10], [3, 'm', 30]] };
  const b = { achievements: { a2: '2/2', a1: '9/9' }, days: { d1: { g: 1, l: 20, xp: 5 }, d2: { g: 1, l: 1, xp: 1 } }, history: [[2, 'm', 20], [3, 'm', 30]] };
  const m = mergeData(a, b);
  assert.deepEqual(m.achievements, { a1: '1/1', a2: '2/2' });
  assert.deepEqual(m.days, { d1: { g: 2, l: 20, xp: 5 }, d2: { g: 1, l: 1, xp: 1 } });
  assert.deepEqual(m.history.map((h) => h[0]), [1, 2, 3]);
});

test('nombre y foto: gana el último cambio; la calidad visual es de cada dispositivo', () => {
  const a = { identity: { name: 'Viejo' }, settings: { music: 10, quality: 'low' } };
  const b = { identity: { name: 'Nuevo' }, settings: { music: 90, quality: 'high' } };
  const m = mergeData(a, b, { identity: 1, settings: 1 }, { identity: 2, settings: 2 });
  assert.equal(m.identity.name, 'Nuevo');
  assert.deepEqual(m.settings, { music: 90, quality: 'low' });
  assert.equal(mergeData(a, b, { identity: 5 }, { identity: 2 }).identity.name, 'Viejo');
});

test('el sonido es de cada dispositivo y el tutorial basta con hacerlo en uno', () => {
  const m = mergeData({ muted: true, tutorialDone: false }, { muted: false, tutorialDone: true });
  assert.equal(m.muted, true); assert.equal(m.tutorialDone, true);
});

test('fusionar dos veces da lo mismo (no se duplica nada)', () => {
  const a = { records: { marathon: [rec(5)] }, history: [[1, 'm', 1]], profile: { games: 3 } };
  const b = { records: { marathon: [rec(7)] }, history: [[2, 'm', 2]], profile: { games: 4 } };
  const once = mergeData(a, b);
  assert.equal(stableJson(mergeData(once, b)), stableJson(once));
  assert.equal(stableJson(mergeData(once, once)), stableJson(once));
});

test('un dispositivo sin nada recibe todo lo de la cuenta', () => {
  const b = { identity: { name: 'David', photo: null }, records: { zen: [rec(1)] } };
  assert.deepEqual(mergeData({}, b), { identity: b.identity, records: b.records });
});
