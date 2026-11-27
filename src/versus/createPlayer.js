import { createGame } from '../core/game/index.js';
import { seededRandom } from '../util/seededRandom.js';
import { VERSUS_MODE } from './versusMode.js';

/** Un jugador: su partida (las mismas piezas que el rival), sus controles y la basura que le espera. */
export function createPlayer(index, seed, onEvent) {
  const p = {
    index,
    pending: 0,       // líneas de basura que le llegarán al fijar una pieza sin limpiar
    cleared: false,   // la última pieza limpió líneas
    sent: 0,
    input: { left: false, right: false, dir: 0, dasT: 0, arrT: 0 },
    padHeld: {},
    flash: 0,         // destello al recibir basura
    game: null,
  };
  p.game = createGame(VERSUS_MODE, { rng: seededRandom(seed), emit: (name, data) => onEvent(p, name, data || {}) });
  return p;
}
