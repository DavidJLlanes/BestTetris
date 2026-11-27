import { KEYMAP } from '../config/controls.js';
import { press, release } from './press.js';
import { menuBack } from '../ui/menuNav.js';
import { overlayDepth } from '../ui/overlays.js';
import { app } from '../app/state.js';
import { startGame } from '../app/startGame.js';
import { setInput } from './setInput.js';

/** Teclado. Las teclas repetidas por el sistema se ignoran: el desplazamiento es nuestro. */
export function bindKeyboard() {
  addEventListener('keydown', (e) => {
    const act = KEYMAP[e.code];
    if (!act) {
      if (e.code === 'Enter' && app.screen === 'menu' && overlayDepth() === 1 && document.activeElement === document.body) startGame(app.modeDef || app.modeId);
      return;
    }
    const typing = document.activeElement && document.activeElement.tagName === 'INPUT';
    if (typing && act !== 'pause') return;
    if (app.screen !== 'play' && ['left', 'right', 'cw', 'ccw', 'soft', 'hard'].includes(act)) return; // los menús usan el foco del navegador
    e.preventDefault();
    if (e.repeat) return;
    setInput('keys');
    if (act === 'pause' && overlayDepth() > 1) { menuBack(); return; }
    press(act);
  });
  addEventListener('keyup', (e) => { const act = KEYMAP[e.code]; if (act) release(act); });
}
