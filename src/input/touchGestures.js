import { app, canControl } from '../app/state.js';
import { tryMove, tryRotate, hardDrop } from '../core/game/index.js';
import { view } from '../render/view.js';
import { vibrate } from './haptics.js';
import { setInput } from './setInput.js';
import { createGesture } from './gestures/createGesture.js';

/** Qué hace cada acción del reconocedor sobre la partida. */
const APPLY = {
  left: (g) => tryMove(g, -1, 0) && vibrate(3),
  right: (g) => tryMove(g, 1, 0) && vibrate(3),
  down: (g) => tryMove(g, 0, 1) && g.emit('softDrop', {}),
  hard: (g) => { vibrate(14); hardDrop(g); },
  ccw: (g) => tryRotate(g, -1) && vibrate(6),
  cw: (g) => tryRotate(g, 1) && vibrate(6),
};

/**
 * Gestos sobre el tablero (ver gestures/createGesture.js): arrastrar mueve, arrastrar hacia
 * abajo baja, un golpe rápido arriba o abajo suelta de golpe y un toque gira. Un dedo cada vez.
 */
export function bindTouchGestures(el) {
  let gesture = null, id = null, left = 0;
  const run = (actions) => { if (!canControl()) return; for (const a of actions) APPLY[a](app.game); };
  el.addEventListener('pointerdown', (e) => {
    if (app.screen !== 'play' || e.pointerType === 'mouse' || gesture) return;
    setInput('touch');
    const r = el.getBoundingClientRect();
    left = r.left;
    id = e.pointerId;
    gesture = createGesture(e.clientX - left, e.clientY, e.timeStamp, view.cell, r.width);
  });
  el.addEventListener('pointermove', (e) => {
    if (!gesture || e.pointerId !== id) return;
    const list = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    for (const ev of list.length ? list : [e]) run(gesture.move(ev.clientX - left, ev.clientY, ev.timeStamp));
  });
  el.addEventListener('pointerup', (e) => {
    if (!gesture || e.pointerId !== id) return;
    const g = gesture; gesture = null;
    run(g.end(e.clientX - left, e.clientY, e.timeStamp));
  });
  el.addEventListener('pointercancel', (e) => { if (e.pointerId === id) gesture = null; });
}
