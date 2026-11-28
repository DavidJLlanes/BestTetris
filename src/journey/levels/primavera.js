/** Niveles del tramo 2: llegan los astros. */
export default {
  cancer: { goal: { type: 'astros', n: 3 }, ch: [{ type: 'time', n: 90 }, { type: 'noUndo' }], speed: 0.75, board: { rows: 3, astros: 3 } },
  'corona-boreal': { goal: { type: 'astros', n: 5 }, ch: [{ type: 'score', n: 5000 }, { type: 'pieces', n: 40 }], speed: 0.72, board: { rows: 4, astros: 5 } },
  boyero: { goal: { type: 'score', n: 6000 }, ch: [{ type: 'lines', n: 12 }, { type: 'combo', n: 2 }], speed: 0.7, rules: { hold: false } },
  virgo: { goal: { type: 'combo', n: 3 }, ch: [{ type: 'noUndo' }, { type: 'score', n: 5000 }], speed: 0.7, board: { rows: 2, astros: 2 } },
  leo: { goal: { type: 'astros', n: 8 }, ch: [{ type: 'time', n: 150 }, { type: 'quads', n: 1 }], speed: 0.68, board: { rows: 5, astros: 8 } },
  hidra: { goal: { type: 'boss', n: 28 }, ch: [{ type: 'time', n: 180 }, { type: 'noHold' }], speed: 0.65, board: { rows: 3, astros: 2 },
    boss: { hp: 28, every: 15, attacks: ['garbage', 'dark'] } },
};
