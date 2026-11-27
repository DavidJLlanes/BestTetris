import { motion } from './state.js';

/** Al girar, la pieza visual arranca algo girada hacia atrás y se asienta en su sitio. */
export function kickRotation(steps) {
  const quarter = Math.PI / 2;
  motion.angle = -Math.sign(steps) * quarter * (steps === 2 ? 0.5 : 0.35);
  motion.scale = 1.04;
}
