import { TYPES } from '../../config/shapes.js';

/** Generador de bolsa de 7: cada tanda contiene todas las piezas una vez, en orden aleatorio. */
export function createBag(rng = Math.random) {
  let bag = [];
  return function next() {
    if (!bag.length) {
      bag = TYPES.slice();
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    return bag.pop();
  };
}
