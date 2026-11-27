import { VERSION } from './format.js';

/**
 * Pasos para convertir copias antiguas al formato actual. Cada paso recibe los datos
 * de la versión n y devuelve los de la n+1. Así ninguna copia antigua deja de valer.
 */
const STEPS = {
  // 1: (data) => ({ ...data, nuevoCampo: valorPorDefecto }),
};

export function migrate(data, fromVersion) {
  let d = data;
  for (let v = fromVersion; v < VERSION; v++) d = STEPS[v] ? STEPS[v](d) : d;
  return d;
}
