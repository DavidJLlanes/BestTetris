import { $ } from '../../util/dom.js';
import { app } from '../../app/state.js';
import { onOpen } from '../overlays.js';
import { goMenu } from '../../app/goMenu.js';
import { startVersus, leaveVersus } from '../../versus/startVersus.js';
import { pauseVersus, resumeVersus } from '../../versus/pauseVersus.js';
import { connectedPads } from '../../versus/versusPads.js';
import { bindVersusKeys } from '../../versus/versusKeys.js';

const padsText = (n) => (n >= 2 ? '🎮 🎮 Dos mandos conectados: cada uno juega con el suyo.'
  : n === 1 ? '🎮 Un mando conectado: lo usa el Jugador 1. El Jugador 2 juega con las flechas.'
    : 'Sin mandos: el teclado se reparte entre los dos. Conecta mandos cuando quieras.');

/** Pantallas del modo a dos: preparación, pausa y final de ronda. */
export function bindVersusPanel() {
  bindVersusKeys();
  const refresh = () => { $('vs-pads').textContent = padsText(connectedPads().length); };
  onOpen('ov-versus', refresh);
  addEventListener('gamepadconnected', refresh);
  addEventListener('gamepaddisconnected', refresh);
  $('btn-pause').addEventListener('click', () => { if (app.screen === 'versus') pauseVersus(); });
  $('vs-start').addEventListener('click', () => startVersus({ newSeries: true }));
  $('vpause-resume').addEventListener('click', resumeVersus);
  $('vover-again').addEventListener('click', () => startVersus());
  const quit = () => leaveVersus(goMenu);
  $('vpause-quit').addEventListener('click', quit);
  $('vover-menu').addEventListener('click', quit);
  document.addEventListener('visibilitychange', () => { if (document.hidden && app.screen === 'versus') pauseVersus(); });
}
