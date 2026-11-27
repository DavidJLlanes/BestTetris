/** Segundos que tarda la pieza en bajar una fila sola, según el nivel. */
export function gravityInterval(level, fixedInterval = null) {
  if (fixedInterval) return fixedInterval;
  return Math.pow(0.8 - (level - 1) * 0.007, level - 1);
}
