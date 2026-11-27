import { POWER_ORDER } from '../powers/powerList.js';

const PER_LINE = 0.25; // 4 líneas cargan un poder

/** Poderes: limpiar líneas carga el medidor; al llenarse recibes un poder para usar cuando quieras. */
export default {
  id: 'powers',
  order: 7.8,
  name: 'Poderes',
  description: 'Carga el medidor y usa poderes',
  icon: '✦',
  record: 'score',
  powers: true,
  rules: {},
  setup(g) { Object.assign(g.custom, { charge: 0, power: null, lines: 0, frozen: 0, next: 0 }); },
  onTick(g, dt) {
    const c = g.custom;
    if (c.frozen > 0) {
      c.frozen -= dt;
      g.lockTimer = 0; // tampoco se fija sola
      if (c.frozen <= 0) { g.rules.fixedInterval = c.savedInterval; g.emit('thaw', {}); }
    }
    if (g.lines === c.lines) return;
    if (!c.power) c.charge = Math.min(1, c.charge + (g.lines - c.lines) * PER_LINE);
    c.lines = g.lines;
    if (c.charge >= 1 && !c.power) {
      c.power = POWER_ORDER[c.next++ % POWER_ORDER.length];
      g.emit('powerReady', { id: c.power });
    }
  },
};
