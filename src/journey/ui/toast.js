import { $ } from '../../util/dom.js';

let timer = 0;

/** Aviso breve sobre el mapa (se va solo). */
export function mapToast(text) {
  const el = $('jm-toast');
  el.textContent = text;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('show'), 2600);
}
