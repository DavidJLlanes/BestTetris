import { app } from '../app/state.js';
import { playSfx } from '../audio/index.js';
import { topOverlay, backOverlay, overlayDepth } from './overlays.js';
import { resume } from '../app/pause.js';

/** Elementos navegables de la pantalla superior, en orden. */
function items() {
  const el = topOverlay();
  if (!el) return [];
  return Array.from(el.querySelectorAll('button:not([disabled]), input:not([type=file])')).filter((x) => x.offsetParent !== null);
}

export function menuNavigate(d) {
  const list = items();
  if (!list.length) return;
  const i = list.indexOf(document.activeElement);
  const next = list[(i + d + list.length) % list.length] || list[0];
  next.focus();
  next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  playSfx('focus');
}

export function menuAdjust(d) {
  const el = document.activeElement;
  if (!el || el.type !== 'range') { menuNavigate(d); return; }
  const step = (+el.step || 1) * ((+el.max - +el.min) > 100 ? 2 : 5);
  el.value = Math.min(+el.max, Math.max(+el.min, +el.value + d * step));
  el.dispatchEvent(new Event('input', { bubbles: true }));
  playSfx('focus');
}

export function menuConfirm() {
  const el = document.activeElement;
  if (!el || !items().includes(el)) { menuNavigate(0); return; }
  if (el.type === 'checkbox') { el.checked = !el.checked; el.dispatchEvent(new Event('input', { bubbles: true })); playSfx('ui'); }
  else if (el.tagName === 'BUTTON') el.click();
}

export function menuBack() {
  if (overlayDepth() > 1) { playSfx('ui'); backOverlay(); return; }
  if (app.screen === 'pause') resume();
}

export function menuStart() { if (app.screen === 'pause' && overlayDepth() <= 1) resume(); }
