/** Puerta de entrada al núcleo: lo único que el resto de la aplicación necesita importar. */
export { createGame } from './createGame.js';
export { spawn } from './spawn.js';
export { tick } from './tick.js';
export { hardDrop } from './hardDrop.js';
export { holdPiece } from './holdPiece.js';
export { tryMove } from '../movement/tryMove.js';
export { tryRotate } from '../movement/tryRotate.js';
export { shiftToWall } from '../movement/shiftToWall.js';
export { ghostY } from '../movement/ghostY.js';
export { onGround } from '../movement/onGround.js';
export { pieceCells } from '../pieces/pieceCells.js';
export { undoMove } from '../undo/undoMove.js';
export { canUndo, undoCost, undoLeft } from '../undo/undoCost.js';
