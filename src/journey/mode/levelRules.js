/** Reglas de la partida de una constelación (sobre las de por defecto). */
export function levelRules(level) {
  const s = level.spec, r = s.rules || {};
  return {
    levelUp: false,
    fixedInterval: s.speed,
    startLevel: 1 + Math.floor((1 - s.speed) * 10), // multiplica los puntos según lo rápido que cae
    previews: 2,
    undo: 2, undoCost: 600,
    star: false,
    hold: r.hold !== false,
    rotate: r.rotate !== false,
    holdLimit: r.holdLimit ?? null,
    stackAlpha: r.stackAlpha ?? 1,
    timeLimit: level.spec.goal.type === 'survive' ? level.spec.goal.n : null,
  };
}
