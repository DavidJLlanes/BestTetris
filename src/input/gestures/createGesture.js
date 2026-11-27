import { GESTURE } from '../../config/gestures.js';

/**
 * Reconocedor de un trazo, sin DOM (se prueba aparte). Cada trazo decide su eje una sola vez:
 *  - horizontal: mueve columna a columna siguiendo al dedo (nunca baja ni suelta);
 *  - vertical: hacia abajo baja fila a fila; al soltar, un golpe rápido (arriba o abajo) suelta de golpe;
 *  - sin salir de la zona muerta y breve: es un toque y gira según el lado.
 * Devuelve acciones: 'left' | 'right' | 'down' | 'hard' | 'ccw' | 'cw'.
 */
export function createGesture(x, y, t, cell, width) {
  const dz = Math.min(GESTURE.deadZoneMax, Math.max(GESTURE.deadZoneMin, cell * GESTURE.deadZone));
  const lock = Math.max(dz, cell * GESTURE.lockCells);
  const s = { sx: x, sy: y, t0: t, col: 0, ay: y, axis: null, moved: false, samples: [[x, y, t]] };

  function move(mx, my, mt) {
    s.samples.push([mx, my, mt]);
    while (s.samples.length > 2 && mt - s.samples[0][2] > GESTURE.velocityWindow * 2) s.samples.shift();
    const dx = mx - s.sx, dy = my - s.sy;
    const out = [];
    if (!s.axis) {
      const dist = Math.hypot(dx, dy);
      if (dist >= dz) s.moved = true; // ya no es un toque
      if (dist < lock) return out;
      s.axis = Math.abs(dx) > Math.abs(dy) * GESTURE.axisBias ? 'x' : 'y';
    }
    if (s.axis === 'x') {
      // La pieza sigue la posición del dedo (no la suma de pasos): ir y volver la deja donde está el dedo
      const want = dx / (cell * GESTURE.stepX);
      if (Math.abs(want - s.col) > GESTURE.hysteresis) {
        const target = Math.round(want);
        while (s.col !== target) { const d = Math.sign(target - s.col); out.push(d < 0 ? 'left' : 'right'); s.col += d; }
      }
    } else {
      const step = cell * GESTURE.stepY;
      while (my - s.ay >= step) { out.push('down'); s.ay += step; }
      if (my < s.ay) s.ay = my; // subir y volver a bajar no cuenta dos veces
    }
    return out;
  }

  function end(ex, ey, et) {
    s.samples.push([ex, ey, et]);
    if (!s.axis) {
      if (s.moved || et - s.t0 > GESTURE.tapMaxMs) return [];
      return [ex < width / 2 ? 'ccw' : 'cw'];
    }
    if (s.axis !== 'y') return [];
    const from = s.samples.find((p) => et - p[2] <= GESTURE.velocityWindow) || s.samples[0];
    const speed = Math.abs(ey - from[1]) / Math.max(16, et - from[2]);
    const travel = Math.abs(ey - s.sy);
    return speed >= GESTURE.flickSpeed && travel >= cell * GESTURE.flickMinCells ? ['hard'] : [];
  }

  return { move, end, get axis() { return s.axis; } };
}
