import {
  LINE_POINTS, TSPIN_POINTS, MINI_TSPIN_POINTS, COMBO_POINTS, BACK_TO_BACK_MULTIPLIER, CLEAR_NAMES,
} from '../../config/scoring.js';

/**
 * Calcula la puntuación de un bloqueo. Función pura: recibe el estado previo
 * ({ level, combo, b2b }) y devuelve los puntos y el nuevo estado de combo y back-to-back.
 */
export function scoreClear({ lines, tspin, level, combo, b2b }) {
  let base = 0, label = '';
  if (tspin === 'full') { base = TSPIN_POINTS[lines]; label = 'GIRO-T'; }
  else if (tspin === 'mini') { base = MINI_TSPIN_POINTS[lines] ?? MINI_TSPIN_POINTS.at(-1); label = 'MINI GIRO-T'; }
  else base = LINE_POINTS[lines];
  if (lines) label = label ? `${label} ${CLEAR_NAMES[lines]}` : CLEAR_NAMES[lines];

  if (!lines) {
    return { points: base * level, label, combo: -1, b2b, backToBack: false, comboCount: 0 };
  }
  const difficult = lines >= 4 || !!tspin;
  const backToBack = difficult && b2b;
  const nextCombo = combo + 1;
  const points = Math.round(base * (backToBack ? BACK_TO_BACK_MULTIPLIER : 1) * level)
    + (nextCombo > 0 ? COMBO_POINTS * nextCombo * level : 0);
  return {
    points,
    label: backToBack ? `B2B ${label}` : label,
    combo: nextCombo,
    comboCount: nextCombo,
    b2b: difficult,
    backToBack,
  };
}
