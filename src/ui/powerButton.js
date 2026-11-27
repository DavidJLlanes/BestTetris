import { $ } from '../util/dom.js';
import { on } from '../app/bus.js';
import { app, canControl } from '../app/state.js';
import { initAudio } from '../audio/index.js';
import { usePower } from '../modes/powers/usePower.js';
import { POWERS } from '../modes/powers/powerList.js';
import { setInput } from '../input/setInput.js';

/** Botón de poder en la barra superior: un anillo que se llena y, cargado, el icono del poder. */
export function bindPowerButton() {
  const btn = $('btn-power'), icon = $('power-icon');
  const refresh = (g) => {
    const show = !!g && !!g.hooks.powers && !g.over;
    btn.hidden = !show;
    if (!show) return;
    const c = g.custom, power = c.power && POWERS[c.power];
    btn.style.setProperty('--charge', power ? 1 : c.charge);
    btn.style.setProperty('--pc', power ? power.color : '#a98bff');
    btn.classList.toggle('ready', !!power);
    icon.textContent = power ? power.icon : '✦';
    btn.title = power ? `${power.name}: ${power.desc} (V)` : 'Limpia líneas para cargar un poder';
  };
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); initAudio(); setInput('touch'); if (canControl()) usePower(app.game); });
  for (const ev of ['gameStart', 'spawn', 'clear', 'rowsRemoved', 'powerReady', 'power', 'finish', 'menu']) on(ev, ({ game }) => refresh(game));
}
