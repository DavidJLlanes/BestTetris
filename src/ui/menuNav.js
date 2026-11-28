import { app } from '../app/state.js';
import { playSfx } from '../audio/index.js';
import { topOverlay, backOverlay, overlayDepth } from './overlays.js';
import { resume } from '../app/pause.js';
import { navItems } from './nav/navItems.js';
import { spatialNext } from './nav/spatialNext.js';
import { navHandler } from './nav/navHandlers.js';
import { padFocus } from './nav/padFocus.js';
import { scrollPanel } from './nav/scrollPanel.js';

const current = (list) => (list.includes(document.activeElement) ? document.activeElement : null);

/** Mueve el foco en una dirección (arriba, abajo, izquierda, derecha) por la pantalla de arriba. */
export function menuMove(dir) {
  const top = topOverlay();
  if (!top) return;
  const own = navHandler(top.id);
  if (own && own(dir)) return;
  const list = navItems(top);
  if (!list.length) return;
  const at = current(list);
  if (!at) { padFocus(list.find((el) => el.hasAttribute('autofocus')) || list[0]); return; }
  const next = spatialNext(at, list, dir); // en el borde se queda donde está, como en consola
  // si lo siguiente queda lejos (una lista larga sin botones en medio), primero se desplaza el panel
  const far = next && Math.abs(next.getBoundingClientRect().top - at.getBoundingClientRect().top) > innerHeight * 0.75;
  if ((!next || far) && (dir === 'up' || dir === 'down') && scrollPanel(dir, at)) return;
  if (next) padFocus(next);
}

/** Compatibilidad: avanzar o retroceder en orden. */
export function menuNavigate(d) { menuMove(d > 0 ? 'down' : d < 0 ? 'up' : 'down'); }

/** Izquierda o derecha: cambia deslizadores y desplegables; en lo demás, mueve el foco. */
export function menuAdjust(d) {
  const el = document.activeElement;
  if (el && el.type === 'range' && el.closest('.overlay')) {
    const step = (+el.step || 1) * ((+el.max - +el.min) > 100 ? 2 : 5);
    el.value = Math.min(+el.max, Math.max(+el.min, +el.value + d * step));
    el.dispatchEvent(new Event('input', { bubbles: true }));
    playSfx('focus');
    return;
  }
  if (el && el.tagName === 'SELECT') {
    el.selectedIndex = Math.min(el.options.length - 1, Math.max(0, el.selectedIndex + d));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    playSfx('focus');
    return;
  }
  menuMove(d < 0 ? 'left' : 'right');
}

/** A: pulsa lo enfocado (botón, casilla, desplegable, casilla del editor…). */
export function menuConfirm() {
  const el = document.activeElement;
  const top = topOverlay();
  if (!el || !top || !top.contains(el)) { menuMove('down'); return; }
  if (el.type === 'checkbox') { el.checked = !el.checked; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); playSfx('ui'); return; }
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.select && el.select(); return; }
  if (el.tagName === 'SELECT') { menuAdjust(1); return; }
  el.click();
}

export function menuBack() {
  if (overlayDepth() > 1) { playSfx('ui'); backOverlay(); return; }
  if (app.screen === 'pause') resume();
}

export function menuStart() { if (app.screen === 'pause' && overlayDepth() <= 1) resume(); }
