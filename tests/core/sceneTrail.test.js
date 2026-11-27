import test from 'node:test';
import assert from 'node:assert/strict';
import { sceneIndex } from '../../src/scenes/sceneIndex.js';
import { resetTrail, enterScene, summarizeTrail } from '../../src/scenes/sceneTrail.js';
import { SCENES } from '../../src/scenes/sceneList.js';

const g = (sceneDrive, lines, time = 0, score = 0) => ({ hooks: { sceneDrive }, lines, time, score });

test('Viaje recorre las escenas en orden y se queda en la última', () => {
  assert.equal(sceneIndex(g('journey', 0), 3), 0);
  assert.equal(sceneIndex(g('journey', 19), 3), 1);
  assert.equal(sceneIndex(g('journey', 50), 3), SCENES.length - 1);
});

test('Deriva cambia de escena con el tiempo y da la vuelta', () => {
  assert.equal(sceneIndex(g('drift', 99, 0), 2), 2);
  assert.equal(sceneIndex(g('drift', 0, 95), 2), 3);
  assert.equal(sceneIndex(g('drift', 0, 90 * SCENES.length), 2), 2);
});

test('el recorrido suma líneas, puntos y tiempo por escena', () => {
  resetTrail();
  enterScene(SCENES[0], g(null, 0, 0, 0));
  enterScene(SCENES[1], g(null, 8, 60, 900));
  enterScene(SCENES[0], g(null, 16, 100, 2000));
  const rows = summarizeTrail(g(null, 20, 130, 2600));
  assert.equal(rows.length, 2);
  assert.deepEqual([rows[0].lines, rows[0].score, rows[0].time], [12, 1500, 90]);
  assert.deepEqual([rows[1].lines, rows[1].score, rows[1].time], [8, 1100, 40]);
});
