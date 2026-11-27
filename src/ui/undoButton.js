import { $ } from '../util/dom.js';
import { on } from '../app/bus.js';
import { app } from '../app/state.js';
import { initAudio } from '../audio/index.js';
import { requestUndo } from '../app/requestUndo.js';
import { undoLeft, canUndo } from '../core/game/index.js';
import { setInput } from '../input/setInput.js';

/** Botón ↶ de la barra superior: solo aparece en los modos con deshacer y muestra los usos que quedan. */
export function bindUndoButton() {
  const btn = $('btn-undo'), left = $('undo-left');
  const refresh = (g) => {
    const allowed = !!g && !!g.rules.undo && !g.over;
    btn.hidden = !allowed;
    if (!allowed) return;
    const n = undoLeft(g);
    left.textContent = Number.isFinite(n) ? n : '';
    btn.classList.toggle('ready', canUndo(g));
  };
  btn.addEventListener('pointerdown', (e) => { e.preventDefault(); initAudio(); setInput('touch'); requestUndo(app.game); });
  btn.addEventListener('click', (e) => { if (e.detail === 0) requestUndo(app.game); }); // teclado o lector de pantalla
  for (const ev of ['gameStart', 'spawn', 'undo', 'finish', 'clear', 'lock', 'menu']) on(ev, ({ game }) => refresh(game));
}
