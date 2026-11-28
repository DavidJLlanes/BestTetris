import { playSfx } from '../../audio/index.js';

/**
 * Enfoca un elemento elegido con mando o flechas y lo deja a la vista. La clase pad-nav en
 * <html> enciende el aro de foco; tocar o usar el ratón la apaga.
 */
export function padFocus(el, sound = true) {
  if (!el) return;
  document.documentElement.classList.add('pad-nav');
  el.focus({ preventScroll: true });
  el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  if (sound) playSfx('focus');
}

/** Al tocar la pantalla o usar el ratón, fuera el aro de foco. */
export function watchPointerForFocus() {
  addEventListener('pointerdown', () => document.documentElement.classList.remove('pad-nav'), { passive: true, capture: true });
}
