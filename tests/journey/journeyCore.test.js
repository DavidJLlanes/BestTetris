import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGame, spawn, tick, hardDrop } from '../../src/core/game/index.js';
import { createPiece } from '../../src/core/pieces/createPiece.js';
import { MAIN, HIDDEN, EVENTS, ALL_LEVELS, getLevel } from '../../src/journey/catalog.js';
import { GOALS } from '../../src/journey/goals/list.js';
import { CHALLENGES } from '../../src/journey/challenges/list.js';
import { ATTACKS } from '../../src/journey/boss/attacks.js';
import { makeLevelMode } from '../../src/journey/mode/makeLevelMode.js';
import { fillRows } from '../helpers.js';

function play(id, bag = []) {
  const events = [];
  let seed = 7;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const g = createGame(makeLevelMode(getLevel(id), bag), { emit: (name, data) => events.push({ name, data }), rng });
  return { g, names: () => events.map((e) => e.name) };
}
const finishClears = (g) => { for (let i = 0; i < 40 && g.clearing; i++) tick(g, 0.05); };

test('Catálogo: 48 del camino en 8 tramos de 6 con jefe al final, 8 ocultas y 8 de evento', () => {
  assert.equal(MAIN.length, 48);
  assert.equal(HIDDEN.length, 8);
  assert.equal(EVENTS.length, 8);
  for (let t = 0; t < 8; t++) assert.equal(MAIN[t * 6 + 5].kind, 'boss');
  assert.equal(new Set(ALL_LEVELS.map((l) => l.id)).size, ALL_LEVELS.length);
});

test('Cada constelación tiene dibujo, historia, objetivo y dos retos válidos', () => {
  for (const l of ALL_LEVELS) {
    assert.ok(l.spec, `${l.id} sin nivel`);
    assert.ok(GOALS[l.spec.goal.type], `${l.id}: objetivo ${l.spec.goal.type}`);
    assert.equal(l.challenges.length, 2, l.id);
    l.challenges.forEach((c) => assert.ok(CHALLENGES[c.type], `${l.id}: reto ${c.type}`));
    assert.ok(l.sky.story.length > 20, l.id);
    assert.ok(l.sky.stars.length >= 3, l.id);
    l.sky.lines.forEach(([a, b]) => assert.ok(l.sky.stars[a] && l.sky.stars[b], `${l.id}: trazo ${a}-${b}`));
    if (l.spec.boss) l.spec.boss.attacks.forEach((k) => assert.ok(ATTACKS[k], k));
    assert.ok(l.spec.speed > 0.15 && l.spec.speed <= 1, l.id);
  }
});

test('Los tableros iniciales llevan sus elementos', () => {
  const { g } = play('leo');
  const flat = g.board.flat();
  assert.equal(flat.filter((c) => c === 'A').length, 8);
  assert.equal(g.custom.j.start.astros, 8);
});

test('Polvo: la primera línea lo agrieta y deja la fila; la segunda lo rompe', () => {
  const { g } = play('lira');
  g.board.forEach((r) => r.fill(null));
  fillRows(g.board, 21, 21, [0]);
  g.board[21][5] = 'D';
  spawn(g);
  g.cur = createPiece('I'); g.cur.rot = 1; g.cur.x = -2; hardDrop(g);
  finishClears(g);
  assert.equal(g.board[21][5], 'd');
  assert.equal(g.board[21].filter(Boolean).length, 1);
  assert.equal(g.custom.j.dust, 0);
});

test('Hielo: su fila no se limpia hasta que una línea vecina lo funde', () => {
  const { g } = play('can-menor');
  g.board.forEach((r) => r.fill(null));
  fillRows(g.board, 21, 21, []);
  g.board[21][3] = 'C';
  fillRows(g.board, 20, 20, [0]);
  spawn(g);
  g.cur = createPiece('M'); g.cur.x = 0; hardDrop(g); // completa la 20 (sin hielo)
  finishClears(g);
  assert.equal(g.board[21][3], 'W'); // fundido
  assert.equal(g.custom.j.ice, 1);
});

test('Agujero negro: limpiar su fila se traga también la de debajo', () => {
  const { g } = play('libra');
  g.board.forEach((r) => r.fill(null));
  fillRows(g.board, 21, 21, [9]);
  fillRows(g.board, 20, 20, [0]);
  g.board[20][4] = 'H';
  spawn(g);
  g.cur = createPiece('M'); g.cur.x = 0; hardDrop(g);
  finishClears(g);
  assert.equal(g.custom.j.holes, 1);
  assert.equal(g.board.flat().filter(Boolean).length, 0);
});

test('Cometa: rompe toda su columna', () => {
  const { g, names } = play('cruz-del-sur');
  spawn(g);
  g.cur = createPiece('K'); g.cur.x = 3;
  hardDrop(g);
  assert.ok(names().includes('comet'));
  for (let y = 0; y < g.board.length; y++) assert.equal(g.board[y][3], null);
});

test('Jefe: las líneas le quitan vida y al llegar a cero se gana', () => {
  const { g } = play('dragon');
  g.custom.boss.hp = 3;
  g.board.forEach((r) => r.fill(null));
  fillRows(g.board, 18, 21, [0]);
  spawn(g);
  g.cur = createPiece('I'); g.cur.rot = 1; g.cur.x = -2; hardDrop(g);
  finishClears(g);
  assert.equal(g.custom.boss.hp, 0);
  assert.equal(g.won, true);
});

test('Jefe: ataca cada cierto tiempo', () => {
  const { g, names } = play('hidra');
  spawn(g);
  for (let i = 0; i < 170; i++) tick(g, 0.1);
  assert.ok(names().includes('bossAttack'));
});

test('Estrella fugaz: aparece y se atrapa completando su fila', () => {
  const { g, names } = play('triangulo');
  spawn(g);
  for (let i = 0; i < 60 && g.custom.shoot.y === null; i++) tick(g, 0.1);
  const y = g.custom.shoot.y;
  assert.ok(y !== null && names().includes('shootingStar'));
  g.board[y] = g.board[y].map((c) => c || 'J');
  g.board[y][0] = null;
  for (let k = y + 1; k < g.board.length; k++) g.board[k][0] = g.board[k][0] || 'G';
  for (let k = 0; k < y; k++) g.board[k][0] = null;
  g.cur = createPiece('M'); g.cur.x = 0; g.cur.y = 0; hardDrop(g);
  finishClears(g);
  assert.equal(g.custom.j.shooting, 1);
});

test('Reglas raras: sin girar y reserva limitada', () => {
  const { g } = play('flecha');
  spawn(g);
  assert.equal(g.rules.rotate, false);
  const r = play('cabellera').g;
  assert.equal(r.rules.holdLimit, 1);
});

test('Poderes llevados: salen uno tras otro', () => {
  const { g, names } = play('osa-menor', ['zone', 'peek']);
  spawn(g); tick(g, 0.01);
  assert.equal(g.custom.power, 'zone');
  assert.ok(names().includes('powerReady'));
});
