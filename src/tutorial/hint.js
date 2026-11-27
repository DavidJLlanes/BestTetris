import { $ } from '../util/dom.js';

/** Pista flotante sobre el tablero. Cambia de texto con un fundido suave. */
export function showHint(text, progress = '') {
  const el = $('hint');
  el.hidden = false;
  el.classList.remove('swap');
  void el.offsetWidth;
  el.classList.add('swap');
  $('hint-text').textContent = text;
  $('hint-progress').textContent = progress;
}

export function hideHint() { $('hint').hidden = true; }
