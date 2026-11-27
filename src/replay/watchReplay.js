import { on } from '../app/bus.js';
import { recordKey } from '../storage/records.js';
import { loadReplay, saveReplay } from '../storage/replays.js';
import { createRecorder, recordLock, recordProgress } from './createRecorder.js';

/** Graba las partidas de los modos con repetición y prepara el fantasma del mejor intento. */
export const replayState = { rec: null, ghost: null, last: null };

export function watchReplay() {
  on('gameStart', ({ game }) => {
    const mode = game.hooks;
    replayState.rec = mode.replay ? createRecorder(game) : null;
    replayState.ghost = mode.replay ? loadReplay(recordKey(mode)) : null;
  });
  const rec = (game) => (replayState.rec && replayState.rec.mode === game.mode ? replayState.rec : null);
  on('lock', ({ game, piece }) => { const r = rec(game); if (r) recordLock(r, game, piece); });
  on('spawn', ({ game }) => { const r = rec(game); if (r) recordProgress(r, game); });
  on('undo', ({ game }) => { const r = rec(game); if (r) r.valid = false; });
  on('finish', ({ game }) => {
    const r = rec(game);
    replayState.last = r && r.valid && r.events.length ? r : null;
    if (!replayState.last) return;
    recordProgress(r, game);
    r.won = game.won;
  });
  // onFinish decide si es récord; si lo es, guarda la grabación como nuevo fantasma
  on('newBest', ({ game }) => { if (replayState.last) saveReplay(recordKey(game.hooks), replayState.last); });
}
