import { press, release } from './press.js';
import { vibrate } from './haptics.js';

const BUZZ = { hard: 14, hold: 8, cw: 6, ccw: 6, left: 4, right: 4, soft: 4 };

/** Botones táctiles: responden al tocar (pointerdown), no al levantar el dedo. */
export function bindTouchButtons(root) {
  root.querySelectorAll('[data-act]').forEach((b) => {
    const act = b.dataset.act;
    const down = (e) => {
      e.preventDefault();
      b.classList.add('down');
      try { b.setPointerCapture(e.pointerId); } catch { /* sin captura */ }
      vibrate(BUZZ[act] || 5);
      press(act);
    };
    const up = (e) => { e.preventDefault(); b.classList.remove('down'); release(act); };
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('contextmenu', (e) => e.preventDefault());
  });
}
