/** Niveles del tramo 8: todos los elementos juntos. */
export default {
  'corona-austral': { goal: { type: 'astros', n: 6 }, ch: [{ type: 'time', n: 180 }, { type: 'noUndo' }], speed: 0.27, board: { rows: 7, astros: 6, dust: 4, ice: 3 }, shooting: { every: 12, window: 10 } },
  escudo: { goal: { type: 'score', n: 20000 }, ch: [{ type: 'quads', n: 2 }, { type: 'noHold' }], speed: 0.27, rules: { accel: true, stackAlpha: 0.4 } },
  vela: { goal: { type: 'shooting', n: 4 }, ch: [{ type: 'shooting', n: 6 }, { type: 'time', n: 200 }], speed: 0.26, board: { rows: 6, holes: 2 }, comets: 8, holePull: true, shooting: { every: 9, window: 10 } },
  quilla: { goal: { type: 'rock' }, ch: [{ type: 'time', n: 160 }, { type: 'pieces', n: 70 }], speed: 0.25, board: { rows: 8, dust: 3, ice: 3, holes: 1 }, comets: 7 },
  popa: { goal: { type: 'lines', n: 30 }, ch: [{ type: 'combo', n: 5 }, { type: 'noUndo' }], speed: 0.24, rules: { hold: false, stackAlpha: 0.5 } },
  ofiuco: { goal: { type: 'boss', n: 80 }, ch: [{ type: 'time', n: 300 }, { type: 'noUndo' }], speed: 0.22, board: { rows: 3, ice: 1, dust: 1 }, shooting: { every: 14, window: 10 },
    boss: { hp: 80, every: 9, attacks: ['mirror', 'garbage', 'ice', 'hole', 'dark', 'rush', 'dust'] } },
};
