/** Copia independiente de una partida (las funciones se comparten). */
export function cloneGame(g) {
  return {
    ...g,
    board: g.board.map((r) => r.slice()),
    queue: g.queue.slice(),
    stats: { ...g.stats },
    custom: structuredClone(g.custom),
    cur: g.cur && { ...g.cur },
    emit: () => {},
  };
}
