import { raiseGarbage } from '../../core/game/raiseGarbage.js';

const START_EVERY = 10, MIN_EVERY = 2.5, SPEEDUP = 0.94;

/** Marea: la roca sube desde el fondo cada vez más deprisa. Aguanta todo lo que puedas. */
export default {
  id: 'tide',
  order: 5,
  name: 'Marea',
  description: 'La roca sube sin parar',
  icon: '🌊',
  record: 'lines',
  rules: { levelUp: false, garbageRows: 3 },
  setup(g) { g.custom.every = START_EVERY; g.custom.timer = 0; },
  onTick(g, dt) {
    if (g.clearing) return;
    g.custom.timer += dt;
    if (g.custom.timer < g.custom.every) return;
    g.custom.timer = 0;
    g.custom.every = Math.max(MIN_EVERY, g.custom.every * SPEEDUP);
    raiseGarbage(g, 1, g.random);
  },
};
