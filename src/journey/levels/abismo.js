/** Niveles del tramo 7: agujeros negros. */
export default {
  libra: { goal: { type: 'holes', n: 2 }, ch: [{ type: 'time', n: 100 }, { type: 'noUndo' }], speed: 0.32, board: { rows: 5, holes: 2 }, holePull: true },
  capricornio: { goal: { type: 'holes', n: 3 }, ch: [{ type: 'score', n: 14000 }, { type: 'pieces', n: 60 }], speed: 0.31, board: { rows: 6, holes: 3, astros: 3 }, holePull: true },
  acuario: { goal: { type: 'survive', n: 120 }, ch: [{ type: 'lines', n: 25 }, { type: 'noHold' }], speed: 0.32, rules: { accel: true }, board: { rows: 3, holes: 2 }, holePull: true },
  sagitario: { goal: { type: 'multi', n: 6 }, ch: [{ type: 'quads', n: 1 }, { type: 'combo', n: 4 }], speed: 0.3, board: { rows: 4, holes: 2 }, holePull: true, comets: 10 },
  serpiente: { goal: { type: 'holes', n: 4 }, ch: [{ type: 'time', n: 200 }, { type: 'noUndo' }], speed: 0.29, board: { rows: 7, holes: 4, dust: 4 }, holePull: true },
  escorpio: { goal: { type: 'boss', n: 60 }, ch: [{ type: 'time', n: 240 }, { type: 'noHold' }], speed: 0.27, board: { rows: 3, holes: 1 }, holePull: true,
    boss: { hp: 60, every: 10, attacks: ['hole', 'garbage', 'dark', 'rush'] } },
};
