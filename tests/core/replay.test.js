import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, spawn, hardDrop, tick } from '../../src/core/game/index.js';
import { getMode } from '../../src/modes/registry.js';
import { createRecorder, recordLock, recordProgress } from '../../src/replay/createRecorder.js';
import { makeReplayMode } from '../../src/replay/makeReplayMode.js';
import { ghostAt } from '../../src/replay/ghostAt.js';
import { raceDelta } from '../../src/replay/raceDelta.js';

/** Juega unas piezas grabándolas y devuelve la grabación y el tablero final. */
function playAndRecord() {
  const rec = { r: null };
  const g = createGame(getMode('sprint'), { emit: (name, d) => {
    if (name === 'lock') recordLock(rec.r, g, d.piece);
    if (name === 'spawn') recordProgress(rec.r, g);
  } });
  rec.r = createRecorder(g);
  spawn(g);
  for (let i = 0; i < 12; i++) { g.time += 0.5; if (i % 3 === 0) g.cur.x = 0; if (i % 3 === 2) g.cur.x = 6; hardDrop(g); while (g.clearing) tick(g, 0.1); }
  return { replay: rec.r, board: g.board.map((r) => r.join(',')) };
}

test('una repetición reconstruye exactamente el mismo tablero', () => {
  const { replay, board } = playAndRecord();
  const g = createGame(makeReplayMode(replay, getMode('sprint')));
  spawn(g);
  for (let i = 0; i < 400 && !g.over; i++) tick(g, 0.05);
  assert.equal(g.over, true);
  assert.equal(g.won, true);
  assert.deepEqual(g.board.map((r) => r.join(',')), board);
});

test('el fantasma informa del avance en cada instante', () => {
  const replay = { track: [[0, 0, 0], [5, 4, 800], [9, 8, 2000]] };
  assert.deepEqual(ghostAt(replay, 4.9), { lines: 0, score: 0, done: false });
  assert.equal(ghostAt(replay, 6).lines, 4);
  assert.equal(ghostAt(replay, 20).done, true);
  const g = { hooks: { record: 'time' }, lines: 4, time: 4, score: 0 };
  assert.deepEqual(raceDelta(g, replay), { kind: 'time', value: -1 }); // un segundo por delante
});
