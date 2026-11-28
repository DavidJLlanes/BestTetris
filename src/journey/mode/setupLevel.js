import { newCounters } from '../goals/counters.js';
import { seedBoard } from '../elements/seedBoard.js';

/** Prepara el estado de la constelación al empezar: tablero, elementos, jefe y poderes llevados. */
export function setupLevel(g, level, bag) {
  const s = level.spec;
  const c = g.custom;
  c.j = newCounters();
  c.base = s.speed;
  c.accel = s.rules && s.rules.accel ? 1 : 0;
  c.cometEvery = s.comets || 0;
  c.holePull = !!s.holePull;
  c.shootEvery = s.shooting ? s.shooting.every : 0;
  c.shoot = s.shooting ? { y: null, t: 0, life: 0, wait: Math.min(5, s.shooting.every) } : null;
  c.boss = s.boss ? { hp: s.boss.hp, max: s.boss.hp, t: 0, i: 0, dark: 0, rush: 0, flash: 0, warned: false } : null;
  c.alpha = g.rules.stackAlpha;
  c.bag = bag.slice(); // poderes que el jugador trae de la tienda
  c.power = null; c.charge = 1; c.frozen = 0;
  seedBoard(g, s.board);
}
