import { app } from './state.js';
import { MAX_FRAME_DT } from '../config/timing.js';
import { tick } from '../core/game/index.js';
import { updateEffects } from '../effects/updateEffects.js';
import { updateMotion } from '../render/motion/updateMotion.js';
import { updateAutoShift } from '../input/autoShift.js';
import { pollGamepad } from '../input/gamepad/pollGamepad.js';
import { drawBoard } from '../render/drawBoard.js';
import { drawPreview } from '../render/drawPreview.js';
import { view } from '../render/view.js';
import { updateHud } from '../ui/hud.js';
import { perf } from './perf.js';

/** Bucle principal: un paso por fotograma de pantalla (60, 120 o 144 Hz, lo que dé el monitor). */
let last = 0;
let previewKey = '';

function drawSide(g) {
  const key = g ? `${g.hold}|${g.holdUsed}|${g.queue.slice(0, g.rules.previews).join('')}|${view.version}` : `none|${view.version}`;
  if (key === previewKey) return; // solo se redibuja si cambia
  previewKey = key;
  drawPreview(view.hold, [g ? g.hold : null], 1, !!g && g.holdUsed);
  drawPreview(view.next, g ? g.queue.slice(0, g.rules.previews) : [], 5);
}

function frame(now) {
  const dt = Math.min(MAX_FRAME_DT, (now - last) / 1000 || 0);
  last = now;
  const t0 = performance.now();
  pollGamepad(dt);
  const g = app.game;
  if (app.screen === 'play' && g) { updateAutoShift(dt); tick(g, dt); }
  updateMotion(g, dt);
  updateEffects(dt);
  drawBoard(g, app.settings, now);
  drawSide(g);
  updateHud(g);
  perf.record(dt, performance.now() - t0);
  requestAnimationFrame(frame);
}

export function startLoop() { requestAnimationFrame((t) => { last = t; frame(t); }); }
