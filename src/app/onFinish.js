import { app } from './state.js';
import { on, emit } from './bus.js';
import { stopMusic } from '../audio/index.js';
import { saveRecord } from '../storage/records.js';
import { renderGameOver } from '../ui/gameOverPanel.js';
import { showOverlay } from '../ui/overlays.js';

const SHOW_DELAY_MS = 900;

/** Al terminar: guarda el récord y muestra el resumen tras un respiro. */
export function watchFinish() {
  on('finish', ({ game }) => {
    app.screen = 'over';
    stopMusic();
    const isBest = saveRecord(game);
    if (isBest) emit('newBest', { game });
    renderGameOver(game, isBest);
    setTimeout(() => { if (app.game === game) showOverlay('ov-over'); }, SHOW_DELAY_MS);
  });
}
