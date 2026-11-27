import { VS_SPEEDUP_S } from '../config/versus.js';

/** Reglas de cada tablero en el modo a dos: sin deshacer y cada vez más rápido. */
export const VERSUS_MODE = {
  id: 'versus',
  name: '2 jugadores',
  icon: '⚔',
  noRecord: true,
  rules: { levelUp: false, undo: 0 },
  onTick(g) { g.level = 1 + Math.floor(g.time / VS_SPEEDUP_S); },
};
