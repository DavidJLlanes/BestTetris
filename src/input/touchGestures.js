import { app, canControl } from '../app/state.js';
import { tryMove, tryRotate, hardDrop, holdPiece } from '../core/game/index.js';
import { view } from '../render/view.js';
import { vibrate } from './haptics.js';
import { setInput } from './setInput.js';

const STEP = 0.85;            // celdas de arrastre por casilla de movimiento
const FLICK_SPEED = 1.1;      // px/ms hacia abajo para soltar de golpe
const TAP_SLOP = 10;          // px que se toleran en un toque

/**
 * Gestos sobre el tablero: arrastrar mueve la pieza 1:1 con el dedo, tocar gira
 * (mitad izquierda ↺, derecha ↻), un golpe rápido hacia abajo la suelta y hacia arriba la reserva.
 */
export function bindTouchGestures(el) {
  let t = null;
  el.addEventListener('pointerdown', (e) => {
    if (app.screen !== 'play' || e.pointerType === 'mouse') return;
    setInput('touch');
    t = { id: e.pointerId, sx: e.clientX, sy: e.clientY, lx: e.clientX, ly: e.clientY, st: performance.now(), moved: false, samples: [] };
  });
  el.addEventListener('pointermove', (e) => {
    if (!t || e.pointerId !== t.id || !canControl()) return;
    const g = app.game, step = view.cell * STEP;
    t.samples.push({ y: e.clientY, at: performance.now() });
    if (t.samples.length > 5) t.samples.shift();
    while (Math.abs(e.clientX - t.lx) >= step) {
      const d = Math.sign(e.clientX - t.lx);
      if (tryMove(g, d, 0)) vibrate(3);
      t.lx += d * step; t.moved = true;
    }
    while (e.clientY - t.ly >= step) { if (tryMove(g, 0, 1)) g.emit('softDrop', {}); t.ly += step; t.moved = true; }
  });
  const end = (e) => {
    if (!t || e.pointerId !== t.id) return;
    const s = t; t = null;
    if (!canControl()) return;
    const g = app.game, dx = e.clientX - s.sx, dy = e.clientY - s.sy;
    const first = s.samples[0], speed = first ? (e.clientY - first.y) / Math.max(1, performance.now() - first.at) : 0;
    if (speed > FLICK_SPEED && dy > view.cell) { vibrate(14); hardDrop(g); return; }
    if (dy < -view.cell * 2 && Math.abs(dy) > Math.abs(dx) * 1.5) { vibrate(8); holdPiece(g); return; }
    if (!s.moved && Math.abs(dx) < TAP_SLOP && Math.abs(dy) < TAP_SLOP) {
      const r = el.getBoundingClientRect();
      if (tryRotate(g, e.clientX < r.left + r.width / 2 ? -1 : 1)) vibrate(6);
    }
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', () => { t = null; });
}
