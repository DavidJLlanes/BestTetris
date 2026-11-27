/**
 * Recorrido de escenas de la partida: en qué momento se entró en cada una. Al terminar se
 * resume por escena (líneas, puntos y tiempo vividos en ella) para la pantalla de resultados.
 */
let trail = [];

export function resetTrail() { trail = []; }

export function enterScene(scene, g) {
  trail.push({ scene, lines: g.lines, score: g.score, time: g.time });
}

/** Resumen por escena, en orden de llegada, sumando si una escena se repite. */
export function summarizeTrail(g) {
  const out = [];
  trail.forEach((s, i) => {
    const next = trail[i + 1] || { lines: g.lines, score: g.score, time: g.time };
    let row = out.find((r) => r.scene.id === s.scene.id);
    if (!row) out.push(row = { scene: s.scene, lines: 0, score: 0, time: 0 });
    row.lines += Math.max(0, next.lines - s.lines);
    row.score += Math.max(0, next.score - s.score);
    row.time += Math.max(0, next.time - s.time);
  });
  return out;
}
