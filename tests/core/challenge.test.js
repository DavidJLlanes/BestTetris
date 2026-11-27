import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeChallenge, decodeChallenge } from '../../src/social/challenge/challengeCode.js';
import { makeChallengeMode } from '../../src/social/challenge/makeChallengeMode.js';
import { challengeOutcome } from '../../src/social/challenge/challengeOutcome.js';
import { canChallengeMode } from '../../src/social/challenge/challengeable.js';
import { createGame } from '../../src/core/game/createGame.js';
import { getMode } from '../../src/modes/registry.js';

test('el código del reto va y vuelve, con tildes en el nombre', () => {
  const ch = { mode: 'sprint', seed: 4294967295, value: 83.25, name: 'Íñigo 🎮' };
  assert.deepEqual(decodeChallenge(encodeChallenge(ch)), ch);
  assert.equal(decodeChallenge('basura'), null);
});

test('un reto da las mismas piezas a los dos jugadores', () => {
  const mode = makeChallengeMode(getMode('marathon'), { mode: 'marathon', seed: 1234, value: 5000, name: 'A' });
  const a = createGame(mode), b = createGame(mode);
  assert.deepEqual(a.queue, b.queue);
});

test('el resultado compara según el tipo de marca', () => {
  const sprint = makeChallengeMode(getMode('sprint'), { mode: 'sprint', seed: 1, value: 90, name: 'Ana' });
  assert.equal(challengeOutcome({ hooks: sprint, won: true, time: 80 }).won, true);
  assert.equal(challengeOutcome({ hooks: sprint, won: true, time: 95 }).won, false);
  assert.equal(challengeOutcome({ hooks: sprint, won: false, time: 30 }).won, false);
  const ultra = makeChallengeMode(getMode('ultra'), { mode: 'ultra', seed: 1, value: 1000, name: 'Ana' });
  assert.equal(challengeOutcome({ hooks: ultra, score: 1500 }).won, true);
});

test('el diario y los modos sin marca no admiten reto', () => {
  assert.equal(canChallengeMode(getMode('daily')), false);
  assert.equal(canChallengeMode(getMode('tutorial')), false);
  assert.equal(canChallengeMode(getMode('sprint')), true);
});
