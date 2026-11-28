import { scrollParent } from './scrollParent.js';

const isField = (el) => el && el.matches && el.matches('input:not([type=checkbox]):not([type=range]), textarea, select');

/** Sube el panel lo justo para que el campo quede en el tercio alto de lo que se ve. */
function reveal() {
  const vv = window.visualViewport;
  const el = document.activeElement;
  if (!vv || !isField(el)) return;
  const r = el.getBoundingClientRect();
  const top = vv.offsetTop, bottom = vv.offsetTop + vv.height;
  if (r.top >= top + 8 && r.bottom <= bottom - 8) return;
  const box = scrollParent(el);
  if (box) box.scrollTop += r.top - (top + vv.height * 0.3);
}

/**
 * Con el teclado abierto lo visible se encoge pero la aplicación no (para no dar saltos), así
 * que un campo de la mitad de abajo quedaría tapado: al abrirse el teclado se sube el panel.
 */
export function keepFieldVisible() {
  const vv = window.visualViewport;
  if (!vv) return;
  vv.addEventListener('resize', () => setTimeout(reveal, 80));
  addEventListener('focusin', () => setTimeout(reveal, 400));
}
