import { SHAPES } from '../config/shapes.js';

const TYPES = Object.keys(SHAPES);

/**
 * Una pieza de la escena. z = profundidad (0.25 lejos … 1 cerca): las lejanas son más pequeñas,
 * lentas y tenues. Cae girando despacio y balanceándose; al acercarse al suelo se disuelve en luz.
 */
export function spawnScenePiece(w, h, fromTop = true) {
  const z = 0.25 + Math.random() ** 1.6 * 0.75;
  const type = TYPES[Math.floor(Math.random() * TYPES.length)];
  return {
    type, z,
    cells: SHAPES[type].flatMap((row, y) => row.map((v, x) => (v ? [x, y] : null)).filter(Boolean)),
    size: SHAPES[type].length,
    x: Math.random() * w,
    y: fromTop ? -80 - Math.random() * h * 0.4 : Math.random() * h,
    vy: (14 + Math.random() * 10) * (0.4 + z),
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.5,
    sway: Math.random() * Math.PI * 2,
    end: h * (0.72 + Math.random() * 0.25), // dónde empieza a disolverse
    fade: 1,
  };
}
