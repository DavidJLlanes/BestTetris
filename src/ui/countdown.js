import { $ } from '../util/dom.js';
import { app } from '../app/state.js';
import { playSfx } from '../audio/index.js';

const STEP_MS = 600;

/** Cuenta atrás (3-2-1 por defecto) antes de jugar. Se cancela si se cambia de pantalla. */
export function countdown(done, from = 3) {
  app.screen = 'countdown';
  const el = $('countdown');
  el.hidden = false;
  let n = from;
  const step = () => {
    if (app.screen !== 'countdown') { el.hidden = true; return; }
    if (n === 0) { el.hidden = true; playSfx('count', { high: true }); done(); return; }
    el.textContent = n;
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
    playSfx('count');
    n--;
    setTimeout(step, STEP_MS);
  };
  step();
}
