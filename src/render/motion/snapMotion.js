import { motion } from './state.js';

/** Coloca la pieza visual exactamente en su sitio (al aparecer una pieza nueva). */
export function snapMotion(piece) {
  motion.piece = piece;
  motion.x = piece.x;
  motion.y = piece.y - 0.35; // aparece desde un poco más arriba
  motion.angle = 0;
  motion.scale = 0.9;
  motion.alpha = 0;
}
