import { motion } from './state.js';
import { damp } from '../../util/damp.js';
import { dampedSpring as spring } from '../../util/dampedSpring.js';
import { onGround } from '../../core/movement/onGround.js';
import { gravityInterval } from '../../core/rules/gravityInterval.js';

const MOVE_SPEED = 42;   // cuanto mayor, menos retraso visual (≈ 25 ms)
const ROTATE_SPEED = 30;
// Giro: rebote de ~12 % y asentado en ~200 ms. Balanceo: más vivo, un par de vaivenes
const TURN = { stiffness: 1000, ratio: 0.55 };
const SWAY = { stiffness: 1500, ratio: 0.3 };
const SMOOTH_FALL_MIN_INTERVAL = 0.12; // por debajo, la caída es tan rápida que no se interpola

/**
 * La pieza visual sigue a la lógica. Con gravedad lenta, además, se desliza
 * entre filas en lugar de saltar de una a otra.
 */
export function updateMotion(g, dt) {
  const p = g && g.cur;
  if (!p) return;
  if (motion.piece !== p) { motion.piece = p; motion.x = p.x; motion.y = p.y; }
  let fall = 0;
  const interval = gravityInterval(g.level, g.rules.fixedInterval);
  if (!g.softDrop && interval >= SMOOTH_FALL_MIN_INTERVAL && !onGround(g)) fall = Math.min(g.gravAcc, 0.999);
  motion.x = damp(motion.x, p.x, MOVE_SPEED, dt);
  motion.y = damp(motion.y, p.y + fall, MOVE_SPEED, dt);
  [motion.angle, motion.av] = spring(motion.angle, motion.av, TURN.stiffness, TURN.ratio, dt);
  [motion.tilt, motion.tv] = spring(motion.tilt, motion.tv, SWAY.stiffness, SWAY.ratio, dt);
  motion.scale = damp(motion.scale, 1, ROTATE_SPEED, dt);
  motion.alpha = damp(motion.alpha, 1, 25, dt);
}
