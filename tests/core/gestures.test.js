import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGesture } from '../../src/input/gestures/createGesture.js';

const CELL = 26, W = 260;

/** Simula un trazo: puntos [x, y, ms] desde el primero. Devuelve todas las acciones. */
function stroke(points) {
  const [x0, y0, t0] = points[0];
  const g = createGesture(x0, y0, t0, CELL, W);
  const out = [];
  for (const [x, y, t] of points.slice(1, -1)) out.push(...g.move(x, y, t));
  const [ex, ey, et] = points[points.length - 1];
  out.push(...g.move(ex, ey, et), ...g.end(ex, ey, et));
  return out;
}

/** Trazo recto de a a b en `ms`, con temblor opcional (px). */
function line(a, b, ms, jitter = 0, steps = 12) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const k = i / steps, j = i && i < steps ? (i % 2 ? jitter : -jitter) : 0;
    pts.push([a[0] + (b[0] - a[0]) * k + j, a[1] + (b[1] - a[1]) * k - j, 1000 + ms * k]);
  }
  return pts;
}
const count = (list, a) => list.filter((x) => x === a).length;

test('un toque con temblor sigue siendo un giro, según el lado', () => {
  assert.deepEqual(stroke([[60, 200, 0], [66, 205, 40], [58, 196, 80], [63, 202, 120]]), ['ccw']);
  assert.deepEqual(stroke([[200, 200, 0], [194, 207, 60], [204, 198, 110]]), ['cw']);
});

test('un toque largo (duda) no gira', () => {
  assert.deepEqual(stroke([[60, 200, 0], [62, 201, 200], [61, 200, 600]]), []);
});

test('arrastre horizontal torcido (30°) solo mueve en horizontal', () => {
  const out = stroke(line([40, 200], [40 + 3 * CELL, 200 + 3 * CELL * 0.58], 400, 3));
  assert.equal(count(out, 'right'), 3);
  assert.equal(out.length, 3);
});

test('golpe rápido hacia abajo, algo diagonal, suelta de golpe sin moverse de lado', () => {
  const out = stroke(line([130, 100], [150, 100 + 5 * CELL], 110, 2, 6));
  assert.equal(count(out, 'hard'), 1);
  assert.equal(count(out, 'left') + count(out, 'right'), 0);
});

test('golpe rápido hacia arriba también suelta de golpe (y nunca reserva)', () => {
  const out = stroke(line([130, 300], [120, 300 - 4 * CELL], 100, 2, 6));
  assert.deepEqual(out, ['hard']);
});

test('arrastrar hacia abajo despacio baja fila a fila sin soltar de golpe', () => {
  const out = stroke(line([130, 100], [134, 100 + 4 * CELL], 900, 2, 30));
  assert.equal(count(out, 'down'), 4);
  assert.equal(count(out, 'hard'), 0);
});

test('un trazo corto y lento hacia arriba no hace nada', () => {
  assert.deepEqual(stroke(line([130, 300], [131, 300 - 1.5 * CELL], 500, 1)), []);
});

test('deslizar rápido de lado mueve y no suelta', () => {
  const out = stroke(line([30, 200], [30 + 5 * CELL, 210], 120, 2, 8));
  assert.equal(count(out, 'right'), 5);
  assert.equal(count(out, 'hard'), 0);
});

test('arrastrar a un lado y volver deja la pieza donde está el dedo', () => {
  const out = stroke([...line([100, 200], [100 + 3 * CELL, 200], 300), ...line([100 + 3 * CELL, 200], [100 + CELL, 200], 300).map(([x, y, t]) => [x, y, t + 300])]);
  assert.equal(count(out, 'right') - count(out, 'left'), 1);
});
