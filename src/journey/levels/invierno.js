/** Niveles del tramo 5: hielo. */
export default {
  'can-menor': { goal: { type: 'ice', n: 3 }, ch: [{ type: 'time', n: 90 }, { type: 'noUndo' }], speed: 0.45, board: { rows: 4, ice: 3 } },
  geminis: { goal: { type: 'ice', n: 5 }, ch: [{ type: 'pieces', n: 55 }, { type: 'score', n: 9000 }], speed: 0.44, board: { rows: 5, ice: 5, dust: 2 } },
  auriga: { goal: { type: 'survive', n: 120 }, ch: [{ type: 'lines', n: 20 }, { type: 'noHold' }], speed: 0.45, rules: { accel: true }, board: { rows: 2, ice: 2 } },
  tauro: { goal: { type: 'ice', n: 6 }, ch: [{ type: 'time', n: 180 }, { type: 'combo', n: 3 }], speed: 0.42, board: { rows: 6, ice: 6, astros: 3 }, shooting: { every: 14, window: 11 } },
  'can-mayor': { goal: { type: 'quads', n: 2 }, ch: [{ type: 'quads', n: 3 }, { type: 'noUndo' }], speed: 0.4 },
  orion: { goal: { type: 'boss', n: 46 }, ch: [{ type: 'time', n: 220 }, { type: 'noHold' }], speed: 0.38, board: { rows: 3, ice: 2 },
    boss: { hp: 46, every: 12, attacks: ['ice', 'garbage', 'rush', 'dark'] } },
};
