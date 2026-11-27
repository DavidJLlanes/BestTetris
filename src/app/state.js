import { loadSettings } from '../storage/settings.js';

/** Estado global de la aplicación (pantalla actual, partida, ajustes, dispositivo). */
export const app = {
  screen: 'menu', // menu | countdown | play | pause | over
  game: null,
  modeId: 'marathon',
  modeDef: null, // el modo en juego (puede no estar en el registro, como un puzle)
  settings: loadSettings(),
  device: { touch: false, phone: false, landscape: false },
  lastInput: 'keys', // keys | pad | touch: para mostrar las pistas adecuadas
};

export const isPlaying = () => app.screen === 'play' && !!app.game && !app.game.over;
export const canControl = () => isPlaying() && !!app.game.cur && !app.game.clearing && !app.game.hooks.spectate;
