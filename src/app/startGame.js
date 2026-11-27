import { app } from './state.js';
import { emit } from './bus.js';
import { createGame, spawn } from '../core/game/index.js';
import { getMode } from '../modes/registry.js';
import { initAudio, playSfx, startMusic, restartMusic, setMusicLevel } from '../audio/index.js';
import { resetEffects } from '../effects/resetEffects.js';
import { hideOverlays } from '../ui/overlays.js';
import { countdown } from '../ui/countdown.js';
import { setBest } from '../ui/hud.js';
import { bestLabel } from '../storage/records.js';
import { releaseAll } from '../input/state.js';

/** Empieza una partida nueva del modo indicado. */
export function startGame(modeId) {
  initAudio();
  playSfx('ui');
  const mode = getMode(modeId);
  app.modeId = modeId;
  app.game = createGame(mode, { emit: (name, data) => emit(name, { ...data, game: app.game }) });
  releaseAll();
  resetEffects();
  setMusicLevel(app.game.level);
  restartMusic();
  setBest(bestLabel(modeId));
  document.body.dataset.mode = modeId;
  document.body.classList.toggle('no-hold', !app.game.rules.hold);
  document.body.classList.toggle('no-level', !app.game.rules.levelUp);
  hideOverlays();
  emit('gameStart', { game: app.game });
  countdown(() => { app.screen = 'play'; spawn(app.game); startMusic(); });
}
