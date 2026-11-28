/** Niveles de las constelaciones ocultas: retos con una regla rara, más duros que su tramo. */
export default {
  jirafa: { goal: { type: 'lines', n: 6 }, ch: [{ type: 'score', n: 2500 }, { type: 'time', n: 120 }], speed: 0.85, rules: { rotate: false } },
  cabellera: { goal: { type: 'astros', n: 6 }, ch: [{ type: 'time', n: 100 }, { type: 'noUndo' }], speed: 0.65, rules: { holdLimit: 1 }, board: { rows: 5, astros: 6 } },
  zorra: { goal: { type: 'survive', n: 90 }, ch: [{ type: 'lines', n: 15 }, { type: 'score', n: 8000 }], speed: 0.6, rules: { accel: true }, board: { rows: 2, dust: 2 } },
  perseo: { goal: { type: 'shooting', n: 5 }, ch: [{ type: 'noUndo' }, { type: 'time', n: 160 }], speed: 0.48, board: { rows: 5 }, shooting: { every: 8, window: 9 } },
  liebre: { goal: { type: 'combo', n: 5 }, ch: [{ type: 'score', n: 12000 }, { type: 'noUndo' }], speed: 0.42, board: { rows: 2, ice: 2 } },
  camaleon: { goal: { type: 'rock' }, ch: [{ type: 'time', n: 120 }, { type: 'pieces', n: 40 }], speed: 0.36, rules: { rotate: false }, board: { rows: 6 }, comets: 5 },
  grulla: { goal: { type: 'holes', n: 5 }, ch: [{ type: 'noUndo' }, { type: 'time', n: 200 }], speed: 0.3, board: { rows: 8, holes: 5, ice: 3 }, holePull: true },
  fenix: { goal: { type: 'boss', n: 60 }, ch: [{ type: 'noHold' }, { type: 'noUndo' }], speed: 0.26, board: { rows: 2 },
    boss: { hp: 60, every: 10, attacks: ['garbage', 'rush', 'mirror'] } },
};
