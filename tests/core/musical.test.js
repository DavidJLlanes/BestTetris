import { test } from 'node:test';
import assert from 'node:assert/strict';
import { harmonyAt } from '../../src/audio/music/harmony.js';
import { CHORDS, STEPS_PER_BAR } from '../../src/audio/music/score.js';
import { MUSICAL, QUANTIZE, pick } from '../../src/audio/sfx/musical.js';

test('la armonía sigue el acorde de cada compás, transportado', () => {
  for (let bar = 0; bar < CHORDS.length; bar++) {
    const h = harmonyAt(bar * STEPS_PER_BAR + 5, 2);
    assert.deepEqual(h.chord, CHORDS[bar].map((n) => n + 2));
    assert.equal(h.ladder.length, 12);
    // la escalera solo tiene notas del acorde
    for (const n of h.ladder) assert.ok(h.chord.some((c) => (n - c) % 12 === 0));
  }
});

test('los efectos musicales nunca piden una nota fuera de la escalera', () => {
  const h = { ...harmonyAt(0), sixteenth: 0.1 };
  const notes = [];
  const fakeTone = (n) => notes.push(n);
  for (let i = -5; i < 30; i++) { const n = pick(h, i); assert.ok(h.ladder.includes(n)); fakeTone(n); }
  for (const k of Object.keys(MUSICAL)) assert.ok(k in QUANTIZE, `falta el margen de ${k}`);
});
