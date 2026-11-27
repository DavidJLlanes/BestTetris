/**
 * "Luz en cascada": composición original de PRISMA. Re menor, 8 compases en bucle.
 * Melodía en corcheas (8 por compás); null prolonga la nota anterior.
 */
const _ = null;
export const MELODY = [
  [69, _, 72, 74, 72, _, 69, 67],
  [65, _, 67, 69, 70, _, 69, 65],
  [67, _, 69, 72, 77, _, 76, 72],
  [74, _, 72, 69, 67, _, _, _],
  [70, _, 74, 77, 74, 72, 70, _],
  [69, _, 65, 69, 74, _, 72, 69],
  [70, _, 69, 67, 65, _, 67, 69],
  [73, _, 76, 73, 69, _, _, _],
];
/** Rem Sib Fa Do | Solm Rem Sib La */
export const CHORDS = [
  [50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55],
  [55, 58, 62], [50, 53, 57], [46, 50, 53], [45, 49, 52],
];
/** Bajo en corcheas, relativo a la fundamental. */
export const BASS = [0, _, 12, 0, _, 0, 12, _];
export const STEPS_PER_BAR = 16;
export const BARS = MELODY.length;
