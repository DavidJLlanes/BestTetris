import { $ } from '../util/dom.js';
import { on } from '../app/bus.js';
import { app, canControl } from '../app/state.js';
import { initAudio } from '../audio/index.js';
import { setInput } from '../input/setInput.js';
import { startStar } from '../core/star/startStar.js';
import { STAR_MIN } from '../config/star.js';

/**
 * Botón del momento estelar en la barra superior: un anillo que se llena con las líneas,
 * brilla cuando ya se puede usar (desde la mitad) y, durante el momento, muestra el tiempo.
 */
export function bindStarButton() {
  const btn = $('btn-star');
  const refresh = (g) => {
    const show = !!g && !!g.rules.star && !g.over;
    btn.hidden = !show;
    if (!show) return;
    const s = g.custom.star || { charge: 0 };
    const fill = s.active ? s.time / (s.total || 1) : s.charge;
    btn.style.setProperty('--charge', fill.toFixed(3));
    btn.classList.toggle('ready', !s.active && s.charge >= STAR_MIN);
    btn.classList.toggle('full', !s.active && s.charge >= 1);
    btn.classList.toggle('active', !!s.active);
  };
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); initAudio(); setInput('touch'); if (canControl()) startStar(app.game); });
  for (const ev of ['gameStart', 'spawn', 'starCharge', 'starStart', 'starEnd', 'finish', 'menu', 'undo']) on(ev, ({ game }) => refresh(game));
  // Durante el momento estelar el anillo se vacía con el tiempo
  setInterval(() => { const g = app.game; if (g && g.custom.star && g.custom.star.active && !btn.hidden) refresh(g); }, 100);
}
