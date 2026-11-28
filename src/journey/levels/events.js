/** Niveles de la lluvia de estrellas semanal: siempre con estrellas fugaces y polvo estelar doble. */
const RAIN = { every: 7, window: 10 };
export default {
  lagarto: { goal: { type: 'lines', n: 20 }, ch: [{ type: 'shooting', n: 3 }, { type: 'noUndo' }], speed: 0.45, comets: 5, shooting: RAIN },
  unicornio: { goal: { type: 'shooting', n: 6 }, ch: [{ type: 'time', n: 180 }, { type: 'noHold' }], speed: 0.45, board: { rows: 5 }, shooting: RAIN },
  cuervo: { goal: { type: 'astros', n: 10 }, ch: [{ type: 'shooting', n: 3 }, { type: 'time', n: 200 }], speed: 0.45, board: { rows: 6, astros: 10 }, shooting: RAIN },
  copa: { goal: { type: 'combo', n: 4 }, ch: [{ type: 'shooting', n: 3 }, { type: 'noUndo' }], speed: 0.45, board: { rows: 3 }, shooting: RAIN },
  eridano: { goal: { type: 'survive', n: 150 }, ch: [{ type: 'shooting', n: 5 }, { type: 'lines', n: 25 }], speed: 0.5, rules: { accel: true }, shooting: RAIN },
  pavo: { goal: { type: 'score', n: 25000 }, ch: [{ type: 'shooting', n: 4 }, { type: 'quads', n: 1 }], speed: 0.42, board: { rows: 3 }, shooting: RAIN },
  tucan: { goal: { type: 'holes', n: 4 }, ch: [{ type: 'shooting', n: 3 }, { type: 'noUndo' }], speed: 0.42, board: { rows: 6, holes: 4 }, holePull: true, shooting: RAIN },
  paloma: { goal: { type: 'rock' }, ch: [{ type: 'shooting', n: 3 }, { type: 'time', n: 150 }], speed: 0.45, board: { rows: 10 }, comets: 5, shooting: RAIN },
};
