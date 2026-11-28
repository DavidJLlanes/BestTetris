import { map } from './mapState.js';
import { dragBy } from './camera.js';
import { dragScale } from './project.js';
import { hitNode } from './hitNode.js';

const TAP_MOVE = 12; // px que se puede mover el dedo y que siga siendo un toque
const TAP_MS = 450;

/**
 * Arrastrar desplaza el mapa (el cielo sigue al dedo), soltar lo deja deslizarse con inercia y
 * un toque elige parada. La rueda del ratón también desplaza.
 */
export function bindDragInput(canvas, onTap) {
  let id = null, startY = 0, startX = 0, lastY = 0, lastT = 0, t0 = 0, moved = false, vel = 0;
  canvas.addEventListener('pointerdown', (e) => {
    if (id !== null || map.zoom > 0.02 || map.celebrate) return;
    id = e.pointerId; canvas.setPointerCapture(id);
    startY = lastY = e.clientY; startX = e.clientX; t0 = lastT = performance.now(); moved = false; vel = 0;
    map.cam.drag = true; map.cam.target = null; map.cam.v = 0;
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    const now = performance.now(), dy = e.clientY - lastY;
    if (Math.abs(e.clientY - startY) > TAP_MOVE || Math.abs(e.clientX - startX) > TAP_MOVE) moved = true;
    const world = dy / dragScale();
    dragBy(world);
    const dt = Math.max(1, now - lastT) / 1000;
    vel = vel * 0.6 + (world / dt) * 0.4; // velocidad suavizada para la inercia
    lastY = e.clientY; lastT = now;
  });
  const end = (e) => {
    if (e.pointerId !== id) return;
    id = null;
    map.cam.drag = false;
    const quiet = performance.now() - lastT > 90; // si se paró antes de soltar, no sale lanzado
    map.cam.v = quiet ? 0 : Math.max(-4000, Math.min(4000, vel));
    if (!moved && performance.now() - t0 < TAP_MS) {
      const r = canvas.getBoundingClientRect();
      const node = hitNode(e.clientX - r.left, e.clientY - r.top);
      if (node) onTap(node);
    }
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (map.zoom > 0.02 || map.celebrate) return;
    map.cam.target = null;
    map.cam.v += (-e.deltaY / dragScale()) * 9;
  }, { passive: false });
}
