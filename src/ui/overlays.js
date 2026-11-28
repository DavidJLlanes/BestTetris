import { $ } from '../util/dom.js';
import { navItems } from './nav/navItems.js';
import { app } from '../app/state.js';

/**
 * Pila de pantallas superpuestas (menú, pausa, ajustes...). Las transiciones usan solo
 * opacity y transform, que el navegador anima en la GPU sin recalcular el diseño.
 */
const stack = [];
const openers = new Map();
const layered = new Set(); // pantallas abiertas como capa: la de debajo sigue viéndose

export const overlayDepth = () => stack.length;
export const topOverlay = () => $(stack[stack.length - 1]);

/** Registra una función que rellena una pantalla justo antes de mostrarla. */
export function onOpen(id, fn) { openers.set(id, [...(openers.get(id) || []), fn]); }

const lastFocus = new Map(); // al volver a una pantalla, el foco vuelve a donde estaba (mando y teclado)

function focusFirst(el) {
  if (app.device.touch && !document.documentElement.classList.contains('pad-nav')) return;
  const prev = lastFocus.get(el.id);
  if (prev && prev.isConnected && el.contains(prev) && prev.offsetParent !== null) { prev.focus({ preventScroll: true }); return; }
  const list = navItems(el); // solo lo que se ve (un botón oculto no puede recibir el foco)
  const b = list.find((x) => x.hasAttribute('autofocus')) || el.querySelector('#jm-nodes [autofocus]') || list[0]; // autofocus manda aunque vaya después
  if (b) b.focus({ preventScroll: true });
}

function reveal(id) {
  const el = $(id);
  (openers.get(id) || []).forEach((fn) => fn(el));
  el.hidden = false;
  el.classList.remove('leave');
  void el.offsetWidth; // reinicia la animación de entrada
  el.classList.add('enter');
  focusFirst(el);
  // algunas pantallas rellenan sus botones justo después de abrirse: si el foco se quedó fuera, se repite
  requestAnimationFrame(() => { if (!el.hidden && !el.contains(document.activeElement)) focusFirst(el); });
}

function remember() {
  const top = stack[stack.length - 1];
  if (top && $(top).contains(document.activeElement)) lastFocus.set(top, document.activeElement);
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
  layered.clear();
  while (stack.length) conceal(stack.pop());
  stack.push(id);
  reveal(id);
}
/** Abre una pantalla encima. Con { layer: true } la de debajo no se oculta (se ve detrás, como el mapa del Viaje). */
export function pushOverlay(id, { layer = false } = {}) {
  remember();
  lastFocus.delete(id);
  if (stack.length && !layer) conceal(stack[stack.length - 1]);
  if (layer) layered.add(id); else layered.delete(id);
  stack.push(id);
  reveal(id);
}
export function backOverlay() {
  if (stack.length <= 1) return false;
  const top = stack.pop();
  conceal(top);
  if (layered.delete(top)) focusFirst($(stack[stack.length - 1])); // la de debajo nunca se fue
  else reveal(stack[stack.length - 1]);
  return true;
}
export function hideOverlays() { layered.clear(); while (stack.length) conceal(stack.pop()); }
