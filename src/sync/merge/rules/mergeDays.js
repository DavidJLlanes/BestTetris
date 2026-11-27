import { deepMax } from './deepMax.js';

/** Días jugados: por cada día, el mayor número de partidas, líneas y experiencia de los dos lados. */
export const mergeDays = (a, b) => deepMax(a, b);
