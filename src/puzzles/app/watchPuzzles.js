import { $ } from '../../util/dom.js';
import { on } from '../../app/bus.js';
import { app } from '../../app/state.js';
import { showHint, hideHint } from '../../tutorial/hint.js';
import { floatText } from '../../effects/floatText.js';
import { playSfx } from '../../audio/index.js';
import { goalText } from '../goals.js';
import { nextPuzzle } from '../nextPuzzle.js';
import { puzzleLabel } from './puzzleLabel.js';
import { playPuzzle } from './playPuzzle.js';
import { goMenu } from '../../app/goMenu.js';
import { undoMove } from '../../core/undo/undoMove.js';
import { pushOverlay } from '../../ui/overlays.js';

const RETRY_MS = 700; // antes de que salga la pantalla de fin (900 ms)
const FADE_MS = 2600;
const isPuzzle = (g) => g && g.mode === 'puzzle';

/** Pistas, reintentos y "siguiente puzle". Se registra después del tutorial (que oculta la pista). */
export function watchPuzzles() {
  const hint = $('hint');
  on('gameStart', ({ game }) => {
    hint.classList.toggle('top', isPuzzle(game));
    hint.classList.remove('faded');
    if (!isPuzzle(game)) return;
    showHint(goalText(game.hooks.puzzle.goal), puzzleLabel(game.hooks.puzzle));
    // Se aparta en cuanto empieza a caer la pieza: el objetivo sigue en el marcador
    setTimeout(() => { if (app.game === game) hint.classList.add('faded'); }, FADE_MS);
  });
  on('targetHit', ({ game }) => { playSfx('levelUp'); floatText('¡JUSTO!', '', '#5cff9d', 0.8); if (game.over) hideHint(); });
  on('targetMiss', () => { floatText('FUERA DE LA SILUETA', 'otra vez', '#ff5c7a', 0.8); playSfx('miss'); });
  // Fallo en el entrenador: la pieza vuelve arriba sola (deshacer gratis)
  on('spawn', ({ game }) => { if (isPuzzle(game) && game.custom.missed) { game.custom.missed = false; undoMove(game); } });
  on('finish', ({ game }) => {
    const puzzle = isPuzzle(game) && game.hooks.puzzle;
    $('btn-next').hidden = !(game.won && nextPuzzle(puzzle));
    $('btn-edit').hidden = !(puzzle && puzzle.fromEditor);
    if (!puzzle) return;
    if (game.custom.missed) { setTimeout(() => { if (app.game === game) playPuzzle(puzzle, { quick: true }); }, RETRY_MS); return; }
    hint.classList.remove('faded');
    if (!game.won) showHint(game.hooks.puzzle.hint || 'Prueba otro orden o usa la reserva.', 'Pista');
    else hideHint();
  });
  $('btn-edit').addEventListener('click', () => { goMenu(); pushOverlay('ov-editor'); });
  $('btn-next').addEventListener('click', () => { const n = nextPuzzle(app.game && app.game.hooks.puzzle); if (n) playPuzzle(n); });
}
