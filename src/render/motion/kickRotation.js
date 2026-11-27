import { motion } from './state.js';
import { app } from '../../app/state.js';

const calm = () => !app.settings.shake || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

/**
 * Al girar, la lógica ya está en su sitio; la pieza visual arranca un poco girada hacia atrás
 * y un muelle la lleva a su sitio pasándose apenas y volviendo (rebote), mientras se balancea
 * en profundidad (volumen 3D). Si se encadenan giros, el nuevo se suma al que estaba en curso.
 * Con «Rebote y temblor» apagado o «reducir movimiento», solo un asentamiento corto sin rebote.
 */
export function kickRotation(steps) {
  const quarter = Math.PI / 2, dir = Math.sign(steps) || 1;
  if (calm()) { motion.angle = -dir * quarter * 0.18; motion.av = 0; motion.tilt = 0; motion.tv = 0; return; }
  const kick = -dir * quarter * (steps === 2 ? 0.5 : 0.42);
  motion.angle = Math.max(-quarter, Math.min(quarter, motion.angle + kick));
  motion.av *= 0.3;
  motion.tilt = Math.max(-1, Math.min(1, motion.tilt * 0.4 + dir));
  motion.tv = 0;
  motion.scale = 1.05;
}
