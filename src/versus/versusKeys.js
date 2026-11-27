import { app } from '../app/state.js';
import { VS_KEYS } from '../config/versus.js';
import { playerPress, playerRelease } from './playerPress.js';
import { vs } from './state.js';
import { pauseVersus, resumeVersus } from './pauseVersus.js';

const ACTIVE = new Set(['versus', 'vcount']);

function find(code) {
  for (let i = 0; i < 2; i++) if (VS_KEYS[i][code]) return [vs.players[i], VS_KEYS[i][code]];
  return null;
}

/** Teclado partido en dos. Escucha antes que el teclado normal y lo calla mientras se juega a dos. */
export function bindVersusKeys() {
  addEventListener('keydown', (e) => {
    if (app.screen === 'vpause' && (e.code === 'Escape' || e.code === 'KeyP')) { e.preventDefault(); e.stopImmediatePropagation(); resumeVersus(); return; }
    if (!ACTIVE.has(app.screen)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (e.repeat) return;
    if (e.code === 'Escape' || e.code === 'KeyP') { pauseVersus(); return; }
    const hit = app.screen === 'versus' && find(e.code);
    if (hit) playerPress(...hit);
  }, true);
  addEventListener('keyup', (e) => {
    if (!vs.players.length) return;
    const hit = find(e.code);
    if (hit) playerRelease(...hit);
  }, true);
}
