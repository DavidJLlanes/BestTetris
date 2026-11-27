import { app } from '../../app/state.js';
import { pause } from '../../app/pause.js';
import { floatText } from '../../effects/floatText.js';
import { pad } from './state.js';

/** Avisa al conectar un mando y pausa si se desconecta en plena partida. */
export function watchConnection() {
  addEventListener('gamepadconnected', (e) => {
    pad.index = e.gamepad.index;
    document.body.classList.add('has-pad');
    floatText('MANDO CONECTADO', '', '#46e6ff', 0.7);
  });
  addEventListener('gamepaddisconnected', (e) => {
    if (pad.index === e.gamepad.index) pad.index = null;
    if (app.screen === 'play') pause();
  });
}
