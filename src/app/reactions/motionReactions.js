import { on } from '../bus.js';
import { snapMotion } from '../../render/motion/snapMotion.js';
import { kickRotation } from '../../render/motion/kickRotation.js';
import { applyChargedShift } from '../../input/autoShift.js';

/** Animación de la pieza activa y desplazamiento ya cargado al aparecer. */
export function motionReactions() {
  on('spawn', ({ piece }) => { applyChargedShift(); snapMotion(piece); });
  on('rotate', ({ steps }) => kickRotation(steps));
}
