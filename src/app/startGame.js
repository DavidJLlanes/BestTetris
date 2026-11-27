import { app } from './state.js';
import { emit } from './bus.js';
import { createGame, spawn } from '../core/game/index.js';
import { getMode } from '../modes/registry.js';
import { initAudio, playSfx, startMusic, restartMusic, setMusicLevel, setMusicTranspose } from '../audio/index.js';
import { resetEffects } from '../effects/resetEffects.js';
import { hideOverlays } from '../ui/overlays.js';
import { countdown } from '../ui/countdown.js';
import { setBest } from '../ui/hud.js';
import { bestLabel } from '../storage/records.js';
import { releaseAll } from '../input/state.js';
import { seededRandom } from '../util/seededRandom.js';

/** Semilla nueva para cada partida: así cualquier partida se puede convertir en un reto. */
const newSeed = () => (Math.random() * 2 ** 32) >>> 0;

/** Empieza una partida nueva. Acepta el id de un modo del registro o un modo ya construido (puzles). */
export function startGame(modeOrId, { quick = false } = {}) {
  initAudio();
  playSfx('ui');
  const mode = typeof modeOrId === 'string' ? getMode(modeOrId) : modeOrId;
  const modeId = mode.id;
  app.modeId = modeId;
  app.modeDef = mode;
  const seed = mode.createRng ? null : newSeed();
  app.game = createGame(mode, { emit: (name, data) => emit(name, { ...data, game: app.game }), rng: seed === null ? null : seededRandom(seed) });
  app.game.seed = seed;
  releaseAll();
  resetEffects();
  setMusicLevel(app.game.level);
  setMusicTranspose(0);
  restartMusic();
  setBest(bestLabel(mode));
  document.body.dataset.mode = modeId;
  document.body.classList.toggle('no-hold', !app.game.rules.hold);
  document.body.classList.toggle('no-level', !app.game.rules.levelUp);
  hideOverlays();
  emit('gameStart', { game: app.game });
  countdown(() => { app.screen = 'play'; spawn(app.game); startMusic(); }, quick ? 0 : mode.countdown ?? 3);
}
