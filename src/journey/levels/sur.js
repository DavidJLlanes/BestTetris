/** Niveles del tramo 6: cometas. */
export default {
  'cruz-del-sur': { goal: { type: 'rock' }, ch: [{ type: 'time', n: 100 }, { type: 'pieces', n: 50 }], speed: 0.38, board: { rows: 8 }, comets: 6 },
  mosca: { goal: { type: 'astros', n: 8 }, ch: [{ type: 'noUndo' }, { type: 'time', n: 140 }], speed: 0.37, board: { rows: 7, astros: 8 }, comets: 7 },
  'triangulo-austral': { goal: { type: 'dust', n: 6 }, ch: [{ type: 'score', n: 12000 }, { type: 'noHold' }], speed: 0.36, board: { rows: 6, dust: 6, ice: 3 }, comets: 8 },
  lobo: { goal: { type: 'lines', n: 25 }, ch: [{ type: 'combo', n: 4 }, { type: 'time', n: 200 }], speed: 0.35, rules: { holdLimit: 2 }, comets: 9 },
  altar: { goal: { type: 'shooting', n: 4 }, ch: [{ type: 'shooting', n: 5 }, { type: 'noUndo' }], speed: 0.34, board: { rows: 5, ice: 2 }, comets: 8, shooting: { every: 9, window: 11 } },
  centauro: { goal: { type: 'boss', n: 52 }, ch: [{ type: 'time', n: 230 }, { type: 'noUndo' }], speed: 0.32, board: { rows: 3, dust: 2, ice: 2 }, comets: 9,
    boss: { hp: 52, every: 11, attacks: ['garbage', 'ice', 'dust', 'rush'] } },
};
