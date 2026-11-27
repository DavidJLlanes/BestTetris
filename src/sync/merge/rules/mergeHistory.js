const KEEP = 400;

/** Últimas partidas: se juntan las de los dos dispositivos por fecha, sin repetir, y se quedan las 400 últimas. */
export function mergeHistory(a = [], b = []) {
  const seen = new Set();
  return [...a, ...b]
    .filter((g) => Array.isArray(g) && !seen.has(`${g[0]}|${g[1]}|${g[2]}`) && seen.add(`${g[0]}|${g[1]}|${g[2]}`))
    .sort((x, y) => x[0] - y[0])
    .slice(-KEEP);
}
