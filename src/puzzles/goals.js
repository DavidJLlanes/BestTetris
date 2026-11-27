/**
 * Objetivos de puzle: cómo se describen y cuándo se cumplen.
 * Añadir un objetivo nuevo es añadir una entrada aquí.
 */
export const GOALS = {
  lines: { text: (g) => `Limpia ${g.n} ${g.n === 1 ? 'línea' : 'líneas'}`, done: (game, goal) => game.lines >= goal.n, progress: (game, goal) => `${game.lines}/${goal.n}` },
  perfect: { text: () => 'Deja el tablero vacío', done: (game) => game.stats.perfectClears > 0, progress: (game) => String(game.lines) },
  tspin: { text: (g) => `Giro-T que limpie ${g.n} ${g.n === 1 ? 'línea' : 'líneas'}`, done: (game, goal) => game.stats.tspinBest >= goal.n, progress: (game, goal) => `${game.stats.tspinBest || 0}/${goal.n}` },
  place: { text: () => 'Coloca cada pieza en su silueta', done: (game) => game.custom.placed >= game.custom.targets.length, progress: (game) => `${game.custom.placed}/${game.custom.targets.length}` },
};

export const goalText = (goal) => GOALS[goal.type].text(goal);
export const goalDone = (game, goal) => GOALS[goal.type].done(game, goal);
export const goalProgress = (game, goal) => GOALS[goal.type].progress(game, goal);
