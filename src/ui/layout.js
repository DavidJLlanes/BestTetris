import { app } from '../app/state.js';

const PHONE_MAX = 600; // lado corto de la pantalla, en px CSS

/**
 * Detecta el tipo de dispositivo y la orientación, y lo refleja como clases del body
 * para que el CSS elija la disposición: móvil apilado o columnas laterales.
 */
export function detectDevice() {
  const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const short = Math.min(screen.width, screen.height);
  const vw = window.innerWidth, vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const d = app.device;
  d.touch = touch;
  d.phone = touch && short < PHONE_MAX;
  d.landscape = vw > vh;
  const b = document.body.classList;
  b.toggle('is-touch', d.touch);
  b.toggle('is-phone', d.phone);
  b.toggle('is-landscape', d.landscape);
  // Apilado en cualquier pantalla táctil en vertical (móvil o tablet); columnas en el resto
  d.stacked = d.phone || (touch && !d.landscape);
  b.toggle('layout-stacked', d.stacked);
  b.toggle('layout-side', !d.stacked);
  b.toggle('rotate-needed', d.phone && d.landscape);
  return d;
}
