import { SHAPES, TYPES } from '../../config/shapes.js';
import { rotateMatrix } from './rotateMatrix.js';

/** Celdas ocupadas [x, y] de una matriz. */
function matrixCells(matrix) {
  const cells = [];
  matrix.forEach((row, y) => row.forEach((v, x) => { if (v) cells.push([x, y]); }));
  return cells;
}

/** ROTATIONS[tipo][estado 0..3] = celdas relativas de la pieza. Se calcula una vez. */
export const ROTATIONS = Object.fromEntries(TYPES.map((type) => {
  const states = [];
  let m = SHAPES[type];
  for (let s = 0; s < 4; s++) { states.push(matrixCells(m)); m = rotateMatrix(m); }
  return [type, states];
}));
