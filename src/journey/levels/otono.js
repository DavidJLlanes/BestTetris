/** Niveles del tramo 4: estrellas fugaces. */
const SHOOT = { every: 10, window: 12 };
export default {
  triangulo: { goal: { type: 'shooting', n: 2 }, ch: [{ type: 'time', n: 100 }, { type: 'noUndo' }], speed: 0.55, board: { rows: 4 }, shooting: SHOOT },
  aries: { goal: { type: 'shooting', n: 3 }, ch: [{ type: 'score', n: 8000 }, { type: 'noHold' }], speed: 0.53, board: { rows: 5 }, shooting: SHOOT },
  piscis: { goal: { type: 'multi', n: 4 }, ch: [{ type: 'shooting', n: 2 }, { type: 'time', n: 150 }], speed: 0.52, board: { rows: 3, dust: 2 }, shooting: SHOOT },
  andromeda: { goal: { type: 'astros', n: 6 }, ch: [{ type: 'shooting', n: 2 }, { type: 'pieces', n: 60 }], speed: 0.5, board: { rows: 5, astros: 6, dust: 2 }, shooting: SHOOT },
  pegaso: { goal: { type: 'lines', n: 20 }, ch: [{ type: 'score', n: 12000 }, { type: 'noUndo' }], speed: 0.48, rules: { stackAlpha: 0.35 } },
  ballena: { goal: { type: 'boss', n: 40 }, ch: [{ type: 'time', n: 210 }, { type: 'shooting', n: 2 }], speed: 0.45, board: { rows: 3, dust: 2 }, shooting: SHOOT,
    boss: { hp: 40, every: 13, attacks: ['garbage', 'dark', 'dust'] } },
};
