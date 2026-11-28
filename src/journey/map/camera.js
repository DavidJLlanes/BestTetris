import { map } from './mapState.js';
import { SPACING } from './layout.js';

const FRICTION = 2.6; // inercia: cuánto tarda en pararse tras soltar (mayor = antes)
const EDGE_K = 140, EDGE_D = 13; // muelle de los bordes (rebote suave)
const AIM_K = 46, AIM_D = 12.5; // muelle al centrar una parada (sin pasarse apenas)

export const camMin = () => -SPACING * 0.45;
export const camMax = () => map.top - SPACING * 1.1;

/** Un paso de cámara: muelle hacia la parada elegida, o inercia con rebote en los bordes. */
export function updateCamera(dt) {
  const c = map.cam;
  if (c.drag) return;
  const lo = camMin(), hi = camMax();
  if (c.target !== null) {
    const t = Math.max(lo, Math.min(hi, c.target));
    c.v += (t - c.y) * AIM_K * dt;
    c.v *= Math.exp(-AIM_D * dt);
    if (Math.abs(t - c.y) < 0.3 && Math.abs(c.v) < 2) { c.y = t; c.v = 0; }
  } else {
    c.v *= Math.exp(-FRICTION * dt);
    const out = c.y < lo ? lo - c.y : c.y > hi ? hi - c.y : 0;
    if (out) { c.v += out * EDGE_K * dt; c.v *= Math.exp(-EDGE_D * dt); }
    if (!out && Math.abs(c.v) < 1) c.v = 0;
  }
  c.y += c.v * dt;
}

/** Arrastre del dedo: fuera de los límites cuesta más (como una goma). */
export function dragBy(worldDy) {
  const c = map.cam, lo = camMin(), hi = camMax();
  const outside = (c.y < lo && worldDy < 0) || (c.y > hi && worldDy > 0);
  c.y += worldDy * (outside ? 0.35 : 1);
}

/** Centra la cámara en una parada (con su muelle). */
export function aimAt(node) { if (node) map.cam.target = node.y + SPACING * 0.12; }
