import { $ } from '../../util/dom.js';
import { initAudio, playSfx } from '../../audio/index.js';
import { pause } from '../../app/pause.js';
import { pushOverlay } from '../overlays.js';
import { toggleFullscreen } from '../fullscreen.js';
import { isInstalled } from './isInstalled.js';
import { canFullscreen } from './canFullscreen.js';
import { isFullscreen } from './isFullscreen.js';

/**
 * Botón de pantalla completa. Donde el navegador lo permite (Android, iPad, PC) entra y sale
 * de verdad y cambia de icono. En iPhone, donde Safari no lo permite, abre la guía para
 * instalar el juego como app, que sí se abre sin barras. Instalado, el botón sobra y se oculta.
 */
export function bindFullscreenButton() {
  const btn = $('btn-fullscreen');
  const sync = () => {
    const on = isFullscreen();
    btn.hidden = isInstalled() && !on;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-label', on ? 'Salir de pantalla completa' : 'Pantalla completa');
    btn.title = btn.getAttribute('aria-label');
  };
  for (const ev of ['fullscreenchange', 'webkitfullscreenchange']) document.addEventListener(ev, () => { sync(); dispatchEvent(new Event('resize')); });
  sync();
  btn.addEventListener('click', () => {
    initAudio();
    if (canFullscreen()) { toggleFullscreen(); return; }
    playSfx('ui');
    pause(); // solo hace algo si se está jugando
    pushOverlay('ov-install');
  });
}
