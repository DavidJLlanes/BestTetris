import { on } from '../app/bus.js';
import { app } from '../app/state.js';
import { fx } from '../effects/state.js';
import { floatText } from '../effects/floatText.js';
import { applyTheme } from '../ui/themes/applyTheme.js';
import { SCENES, LINES_PER_SCENE } from './sceneList.js';
import { applyScene } from './applyScene.js';

const SKIP = new Set(['seasons', 'tutorial']); // estos modos ya tienen su propio ambiente
let current = -1, start = 0;

/**
 * Escenas que evolucionan durante la partida (ajuste «Escenas»): cada partida empieza en una
 * escena al azar y cada LINES_PER_SCENE líneas pasa a la siguiente con un fundido cinematográfico.
 * Al volver al menú se recupera el fondo y la música que eligió el jugador.
 */
export function sceneReactions() {
  const off = () => {
    if (current < 0) return;
    current = -1;
    delete document.body.dataset.scene;
    fx.ambient = null; fx.ambientOut = null;
    applyTheme(app.settings);
  };
  on('gameStart', ({ game }) => {
    off();
    if (!app.settings.scenes || SKIP.has(app.modeId) || game.hooks.spectate) return;
    start = Math.floor(Math.random() * SCENES.length);
    current = start;
    applyScene(SCENES[current]);
  });
  on('score', ({ game }) => {
    if (current < 0 || !game) return;
    const next = (start + Math.floor(game.lines / LINES_PER_SCENE)) % SCENES.length;
    if (next === current) return;
    current = next;
    applyScene(SCENES[current]);
    floatText(SCENES[current].name.toUpperCase(), 'nueva escena', SCENES[current].tint, 0.9, -1.2);
  });
  on('menu', off);
}
