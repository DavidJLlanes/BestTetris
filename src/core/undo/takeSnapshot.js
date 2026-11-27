/**
 * Foto del estado justo al aparecer una pieza: lo necesario para volver a ese momento.
 * El tiempo no se guarda (sigue corriendo) ni el generador de piezas (la cola sí).
 */
export function takeSnapshot(g) {
  return {
    type: g.cur.type,
    board: g.board.map((r) => r.slice()),
    queue: g.queue.slice(),
    hold: g.hold, holdUsed: g.holdUsed,
    score: g.score, lines: g.lines, level: g.level, combo: g.combo, b2b: g.b2b,
    stats: { ...g.stats },
    custom: structuredClone(g.custom),
  };
}
