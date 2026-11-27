import { app } from '../app/state.js';
import { QUALITY } from '../config/decor.js';
import { HIDDEN, ROWS } from '../config/board.js';
import { highestRow } from '../core/board/highestRow.js';
import { musicPulse } from '../audio/index.js';
import { decor } from './state.js';
import { drawDust } from './dustLayer.js';

let root = null;
const setVar = (k, v, key) => {
  const r = Math.round(v * 100) / 100;
  if (decor[key] === r) return; // solo se toca el estilo si cambia
  decor[key] = r; root.style.setProperty(k, r);
};

/** Un paso de la decoración por fotograma: latido, tensión, profundidad y polvo de luz. */
export function updateDecor(dt, g) {
  if (!root) root = document.getElementById('decor');
  const s = app.settings, q = QUALITY[decor.quality];
  if (!root || s.focus) return;
  decor.flash = Math.max(0, decor.flash - dt * 1.6);
  const live = s.decor.live && decor.quality !== 'low' ? Math.min(1, musicPulse() * 0.28 + decor.flash) : 0;
  setVar('--live', live, 'live');
  const height = g && !g.over ? (HIDDEN + ROWS - highestRow(g.board)) / ROWS : 0;
  setVar('--tension', s.decor.live ? Math.max(0, Math.min(1, (height - 0.6) / 0.3)) * 0.8 : 0, 'tension');
  if (s.decor.tilt && decor.quality !== 'low') {
    const k = 1 - Math.exp(-dt * 3);
    decor.px += (decor.tx - decor.px) * k; decor.py += (decor.ty - decor.py) * k;
    setVar('--px', decor.px, 'pxv'); setVar('--py', decor.py, 'pyv');
  }
  if (!s.decor.dust || !q.fps) return;
  decor.dustAcc += dt;
  if (decor.dustAcc < 1 / q.fps - 0.002) return;
  drawDust(decor.dustAcc, live);
  decor.dustAcc = 0;
}
