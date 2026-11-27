/** Nota MIDI → frecuencia en Hz. */
export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
