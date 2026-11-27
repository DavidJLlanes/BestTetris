import { KICKS, KICKS_I, KICKS_180 } from '../../config/kicks.js';

/** Lista de desplazamientos a probar para un giro concreto. */
export function rotationKicks(type, from, to, steps) {
  if (steps === 2) return KICKS_180;
  return (type === 'I' ? KICKS_I : KICKS)[`${from}>${to}`];
}
