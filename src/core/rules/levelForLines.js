/** Nivel alcanzado tras limpiar `lines` líneas. */
export function levelForLines(lines, startLevel = 1, linesPerLevel = 10) {
  return Math.max(startLevel, Math.floor(lines / linesPerLevel) + 1);
}
