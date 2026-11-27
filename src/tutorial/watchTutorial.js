import { on } from '../app/bus.js';
import { app } from '../app/state.js';
import { STEPS } from './steps.js';
import { showHint, hideHint } from './hint.js';
import { createPiece } from '../core/pieces/createPiece.js';
import { finish } from '../core/game/finish.js';
import { floatText } from '../effects/floatText.js';
import { playSfx } from '../audio/index.js';
import { save } from '../storage/store.js';

const DONE_DELAY_MS = 1600;

function render(g) {
  const step = STEPS[g.custom.step];
  if (!step) return;
  showHint(step.text[app.lastInput] || step.text.keys, `${g.custom.step + 1} / ${STEPS.length}`);
}

function begin(g, index) {
  g.custom.step = index;
  g.custom.count = 0;
  g.custom.advancing = false;
  const step = STEPS[index];
  if (step && step.setup) step.setup(g);
  if (step && step.piece && g.cur) { g.cur = createPiece(step.piece); g.lockTimer = 0; g.emit('spawn', { piece: g.cur }); }
  render(g);
}

/** Sigue los eventos de la partida y avanza el tutorial paso a paso. */
export function watchTutorial() {
  on('gameStart', ({ game }) => { if (game.mode === 'tutorial') begin(game, 0); else hideHint(); });
  on('*', (name, data) => {
    const g = data.game;
    if (!g || g.mode !== 'tutorial' || g.over || g.custom.advancing) return;
    const step = STEPS[g.custom.step];
    if (!step || name !== step.event) return;
    if (++g.custom.count < step.times) return;
    g.custom.advancing = true; // ignora repeticiones mientras pasa al siguiente paso
    const next = g.custom.step + 1;
    playSfx('levelUp');
    floatText('¡BIEN!', '', '#5cff9d', 0.9);
    if (next < STEPS.length) { setTimeout(() => { if (app.game === g) begin(g, next); }, 450); return; }
    showHint('¡Ya sabes jugar! Prueba Maratón para empezar en serio.');
    save('tutorialDone', true);
    setTimeout(() => { if (app.game === g && !g.over) { hideHint(); finish(g, true); } }, DONE_DELAY_MS);
  });
  on('finish', () => { if (!app.game || app.game.mode !== 'tutorial') hideHint(); });
  on('inputChange', () => { if (app.game && app.game.mode === 'tutorial') render(app.game); });
}
