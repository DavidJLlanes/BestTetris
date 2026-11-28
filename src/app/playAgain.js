import { app } from './state.js';
import { startGame } from './startGame.js';
import { getMode } from '../modes/registry.js';
import { openJourney } from '../journey/ui/openJourney.js';

/**
 * «Otra vez»: repite el modo actual. Un modo puede decidir cómo (una constelación del Viaje cobra
 * combustible y lleva sus poderes); el Viaje desde el menú abre su mapa.
 */
export function playAgain() {
  const m = app.modeDef || getMode(app.modeId);
  if (m && m.relaunch) m.relaunch();
  else if (m && m.opensMap) openJourney();
  else startGame(m || app.modeId);
}
