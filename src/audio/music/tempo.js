/** El tempo y la intensidad suben con el nivel. */
export function tempoForLevel(level) {
  return {
    bpm: Math.min(112 + (level - 1) * 4, 168),
    intensity: Math.min(1, 0.2 + (level - 1) * 0.12),
  };
}
