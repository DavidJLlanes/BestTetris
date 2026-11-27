import { loadSettings } from '../storage/settings.js';

/** Estado global de la aplicación (pantalla actual, partida, ajustes, dispositivo). */
export const app = {
  screen: 'menu', // menu | countdown | play | pause | over
  game: null,
  modeId: 'marathon',
  settings: loadSettings(),
  device: { touch: false, phone: false, landscape: false },
  lastInput: 'keys', // keys | pad | touch: para mostrar las pistas adecuadas
};

export const isPlaying = () => app.screen === 'play' && !!app.game && !app.game.over;
export const canControl = () => isPlaying() && !!app.game.cur && !app.game.clearing;
