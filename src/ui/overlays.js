import { $ } from '../util/dom.js';
import { app } from '../app/state.js';

/**
 * Pila de pantallas superpuestas (menú, pausa, ajustes...). Las transiciones usan solo
 * opacity y transform, que el navegador anima en la GPU sin recalcular el diseño.
 */
const stack = [];
const openers = new Map();

export const overlayDepth = () => stack.length;
export const topOverlay = () => $(stack[stack.length - 1]);

/** Registra una función que rellena una pantalla justo antes de mostrarla. */
export function onOpen(id, fn) { openers.set(id, fn); }

function focusFirst(el) {
  if (app.device.touch) return;
  const b = el.querySelector('[autofocus], button, input');
  if (b) b.focus({ preventScroll: true });
}

function reveal(id) {
  const el = $(id);
  if (openers.has(id)) openers.get(id)(el);
  el.hidden = false;
  el.classList.remove('leave');
  void el.offsetWidth; // reinicia la animación de entrada
  el.classList.add('enter');
  focusFirst(el);
}

function conceal(id) {
  const el = $(id);
  if (el.hidden) return;
  el.classList.remove('enter');
  el.classList.add('leave');
  const done = () => { if (el.classList.contains('leave')) { el.hidden = true; el.classList.remove('leave'); } };
  el.addEventListener('animationend', done, { once: true });
  setTimeout(done, 400); // por si la animación no llega a dispararse
}

export function showOverlay(id) {
  while (stack.length) conceal(stack.pop());
  stack.push(id);
  reveal(id);
}
export function pushOverlay(id) {
  if (stack.length) conceal(stack[stack.length - 1]);
  stack.push(id);
  reveal(id);
}
export function backOverlay() {
  if (stack.length <= 1) return false;
  conceal(stack.pop());
  reveal(stack[stack.length - 1]);
  return true;
}
export function hideOverlays() { while (stack.length) conceal(stack.pop()); }
