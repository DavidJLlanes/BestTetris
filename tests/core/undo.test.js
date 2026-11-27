import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, spawn, hardDrop, undoMove, canUndo } from '../../src/core/game/index.js';

const mode = (rules) => ({ id: 'x', rules: { undo: 3, undoCost: 100, ...rules } });
const filled = (g) => g.board.flat().filter(Boolean).length;

test('deshacer devuelve la pieza anterior y deja el tablero como estaba', () => {
  const g = createGame(mode());
  spawn(g);
  const first = g.cur.type;
  assert.equal(canUndo(g), false); // aún no hay jugada que deshacer
  hardDrop(g);
  assert.equal(filled(g), 4);
  const queueAfter = g.queue.slice();
  assert.equal(undoMove(g), true);
  assert.equal(g.cur.type, first);
  assert.equal(filled(g), 0);
  assert.equal(g.stats.undos, 1);
  assert.notDeepEqual(g.queue, queueAfter);
});

test('cada deshacer cuesta más y hay un límite por partida', () => {
  const g = createGame(mode());
  spawn(g);
  g.score = 1000;
  for (let i = 0; i < 4; i++) hardDrop(g);
  const scoreAt = g.history.map((h) => h.score); // puntos al aparecer cada pieza
  undoMove(g); // 100
  assert.equal(g.score, scoreAt[3] - 100);
  undoMove(g); // 200, encadenado: la foto es de antes del primero
  assert.equal(g.score, scoreAt[2] - 300);
  undoMove(g); // 300
  assert.equal(g.stats.undos, 3);
  hardDrop(g);
  assert.equal(canUndo(g), false);
  assert.equal(undoMove(g), false);
});

test('los modos sin deshacer no guardan fotos', () => {
  const g = createGame({ id: 'y', rules: {} });
  spawn(g);
  hardDrop(g);
  assert.equal(g.history.length, 0);
  assert.equal(undoMove(g), false);
});
