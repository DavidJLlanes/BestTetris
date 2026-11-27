import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leaderboard } from '../../src/social/leaderboard/leaderboard.js';
import { getMode } from '../../src/modes/registry.js';

const NOW = new Date(2026, 10, 27, 20, 0).getTime();
const H = 36e5;

test('clasificación de hoy: ordena por marca y descarta deshacer y otros días', () => {
  const hist = [
    [NOW - H, 'marathon', 5000, 30, 200, 0, 0, 'Ana'],
    [NOW - 2 * H, 'marathon', 9000, 50, 300, 0, 0, 'Leo'],
    [NOW - 3 * H, 'marathon', 99999, 90, 300, 0, 1, 'Trampa'],
    [NOW - 30 * H, 'marathon', 50000, 90, 300, 0, 0, 'Ayer'],
  ];
  assert.deepEqual(leaderboard(hist, getMode('marathon'), 'day', NOW).map((e) => e.name), ['Leo', 'Ana']);
  assert.deepEqual(leaderboard(hist, getMode('marathon'), 'week', NOW).map((e) => e.name), ['Ayer', 'Leo', 'Ana']);
});

test('contrarreloj: menos tiempo es mejor y solo cuentan las terminadas', () => {
  const hist = [
    [NOW - H, 'sprint', 0, 40, 95, 1, 0, 'A'],
    [NOW - H, 'sprint', 0, 40, 80, 1, 0, 'B'],
    [NOW - H, 'sprint', 0, 12, 30, 0, 0, 'C'],
  ];
  assert.deepEqual(leaderboard(hist, getMode('sprint'), 'day', NOW).map((e) => e.value), [80, 95]);
});
