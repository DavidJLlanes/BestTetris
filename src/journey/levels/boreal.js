/**
 * Niveles del tramo 1. Por constelación: objetivo, dos retos de estrella, velocidad (segundos por
 * fila), tablero inicial, elementos, reglas raras y, en el jefe, sus ataques. Ver ../mode/.
 */
export default {
  'osa-menor': { goal: { type: 'lines', n: 4 }, ch: [{ type: 'score', n: 1500 }, { type: 'time', n: 60 }], speed: 0.95 },
  casiopea: { goal: { type: 'score', n: 3000 }, ch: [{ type: 'lines', n: 8 }, { type: 'noUndo' }], speed: 0.9 },
  cefeo: { goal: { type: 'survive', n: 60 }, ch: [{ type: 'lines', n: 8 }, { type: 'score', n: 4000 }], speed: 0.85 },
  lince: { goal: { type: 'multi', n: 2 }, ch: [{ type: 'noUndo' }, { type: 'time', n: 120 }], speed: 0.85, board: { rows: 3 } },
  'osa-mayor': { goal: { type: 'rock' }, ch: [{ type: 'time', n: 90 }, { type: 'pieces', n: 30 }], speed: 0.8, board: { rows: 4 } },
  dragon: { goal: { type: 'boss', n: 20 }, ch: [{ type: 'time', n: 150 }, { type: 'noUndo' }], speed: 0.8, board: { rows: 2 },
    boss: { hp: 20, every: 18, attacks: ['garbage'] } },
};
