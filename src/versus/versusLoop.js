import { app } from '../app/state.js';
import { tick } from '../core/game/index.js';
import { view } from '../render/view.js';
import { vs } from './state.js';
import { updateShift } from './playerShift.js';
import { pollVersusPads } from './versusPads.js';
import { pauseVersus } from './pauseVersus.js';
import { drawVersusBoard } from './render/drawVersusBoard.js';
import { drawVersusSide } from './screen/drawVersusSide.js';
import { screenUi } from './screen/screenUi.js';

const PLAYING = new Set(['versus', 'vcount', 'vpause', 'vover']);
let wasPlaying = false;

export const versusActive = () => PLAYING.has(app.screen) && vs.players.length === 2;

/** Un fotograma del modo a dos: mandos, lógica de los dos tableros y dibujo. */
export function updateVersus(dt) {
  const playing = app.screen === 'versus';
  if (playing || app.screen === 'vcount') {
    if (pollVersusPads(!wasPlaying)) pauseVersus();
  }
  wasPlaying = playing || app.screen === 'vcount';
  if (playing) {
    for (const p of vs.players) { updateShift(p, dt); tick(p.game, dt); if (app.screen !== 'versus') break; }
  }
  const ui = screenUi();
  vs.players.forEach((p, i) => {
    drawVersusBoard(ui.parts[i].board, p, { cell: ui.cell, dpr: view.dpr, dt, settings: app.settings });
    drawVersusSide(ui.parts[i], p, vs.wins[i]);
  });
}
