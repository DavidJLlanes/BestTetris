import { app } from '../app/state.js';
import { topOverlay } from '../ui/overlays.js';
import { menuMove, menuAdjust } from '../ui/menuNav.js';

const DIR = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
const TEXT = /^(text|search|email|password|number|url|tel)$/;

/**
 * Flechas en los menús (fuera de la partida): mueven el foco por la pantalla igual que el mando.
 * En un campo de texto, izquierda y derecha siguen moviendo el cursor; en un deslizador, lo cambian.
 */
export function bindKeyboardMenu() {
  addEventListener('keydown', (e) => {
    const dir = DIR[e.key];
    if (!dir || e.altKey || e.ctrlKey || e.metaKey) return;
    if (app.screen === 'play' || app.screen === 'countdown' || !topOverlay()) return;
    const el = document.activeElement;
    const horizontal = dir === 'left' || dir === 'right';
    if (horizontal && el && ((el.tagName === 'INPUT' && TEXT.test(el.type)) || el.tagName === 'TEXTAREA')) return;
    e.preventDefault();
    if (horizontal && el && (el.type === 'range' || el.tagName === 'SELECT')) menuAdjust(dir === 'left' ? -1 : 1);
    else menuMove(dir);
  });
}
