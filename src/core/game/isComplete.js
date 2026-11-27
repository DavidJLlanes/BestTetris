/** ¿Se ha cumplido el objetivo del modo? Por defecto, llegar a goalLines. */
export function isComplete(g) {
  if (g.hooks.isComplete) return g.hooks.isComplete(g);
  return !!g.rules.goalLines && g.lines >= g.rules.goalLines;
}
