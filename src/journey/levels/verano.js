/** Niveles del tramo 3: polvo cósmico. */
export default {
  lira: { goal: { type: 'dust', n: 3 }, ch: [{ type: 'time', n: 90 }, { type: 'noUndo' }], speed: 0.65, board: { rows: 3, dust: 3 } },
  flecha: { goal: { type: 'lines', n: 6 }, ch: [{ type: 'score', n: 3000 }, { type: 'time', n: 100 }], speed: 0.65, rules: { rotate: false } },
  delfin: { goal: { type: 'dust', n: 5 }, ch: [{ type: 'pieces', n: 45 }, { type: 'score', n: 6000 }], speed: 0.62, board: { rows: 4, dust: 5, astros: 2 } },
  aguila: { goal: { type: 'quads', n: 1 }, ch: [{ type: 'quads', n: 2 }, { type: 'noHold' }], speed: 0.6 },
  cisne: { goal: { type: 'dust', n: 6 }, ch: [{ type: 'time', n: 150 }, { type: 'combo', n: 3 }], speed: 0.58, board: { rows: 5, dust: 6, astros: 2 } },
  hercules: { goal: { type: 'boss', n: 34 }, ch: [{ type: 'time', n: 200 }, { type: 'noUndo' }], speed: 0.55, board: { rows: 3, dust: 2 },
    boss: { hp: 34, every: 14, attacks: ['dust', 'garbage', 'rush'] } },
};
