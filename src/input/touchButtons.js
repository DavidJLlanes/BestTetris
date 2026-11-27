import { press, release } from './press.js';
import { vibrate } from './haptics.js';
import { setInput } from './setInput.js';

// Girar, reservar y soltar vibran desde la jugada (hapticReactions), así no vibran dos veces
const BUZZ = { left: 4, right: 4, soft: 4 };

/** Botones táctiles: responden al tocar (pointerdown), no al levantar el dedo. */
export function bindTouchButtons(root) {
  root.querySelectorAll('[data-act]').forEach((b) => {
    const act = b.dataset.act;
    const down = (e) => {
      e.preventDefault();
      b.classList.add('down');
      try { b.setPointerCapture(e.pointerId); } catch { /* sin captura */ }
      setInput('touch');
      if (BUZZ[act]) vibrate(BUZZ[act]);
      press(act);
    };
    const up = (e) => { e.preventDefault(); b.classList.remove('down'); release(act); };
    b.addEventListener('pointerdown', down);
    b.addEventListener('pointerup', up);
    b.addEventListener('pointercancel', up);
    b.addEventListener('contextmenu', (e) => e.preventDefault());
  });
}
