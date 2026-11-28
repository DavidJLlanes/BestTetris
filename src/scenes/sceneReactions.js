import { on } from '../app/bus.js';
import { app } from '../app/state.js';
import { fx } from '../effects/state.js';
import { floatText } from '../effects/floatText.js';
import { applyTheme } from '../ui/themes/applyTheme.js';
import { SCENES } from './sceneList.js';
import { applyScene } from './applyScene.js';
import { sceneIndex } from './sceneIndex.js';
import { resetTrail, enterScene } from './sceneTrail.js';

const SKIP = new Set(['seasons', 'tutorial']); // estos modos ya tienen su propio ambiente
let current = -1, start = 0;

/**
 * Escenas que evolucionan durante la partida. Con el ajuste «Escenas» cada partida empieza en
 * una al azar y avanza con las líneas; los modos Viaje y Deriva las recorren siempre a su manera
 * (mode.sceneDrive). Cada cambio es un fundido largo y queda apuntado en el recorrido.
 * Al volver al menú se recupera el fondo y la música que eligió el jugador.
 */
export function sceneReactions() {
  const off = () => {
    if (current < 0) return;
    current = -1;
    delete document.body.dataset.scene;
    if (fx.ambient) fx.ambientOut = fx.ambient; // las partículas se desvanecen, no desaparecen de golpe
    fx.ambient = null;
    applyTheme(app.settings);
  };
  const update = ({ game }) => {
    if (current < 0 || !game || game.over || game.hooks.scene) return;
    const next = sceneIndex(game, start);
    if (next === current) return;
    current = next;
    const scene = SCENES[current];
    applyScene(scene);
    enterScene(scene, game);
    const sub = game.hooks.sceneDrive === 'journey' ? `escena ${current + 1} de ${SCENES.length}` : 'nueva escena';
    floatText(scene.name.toUpperCase(), sub, scene.tint, 0.9, -1.2);
  };
  on('gameStart', ({ game }) => {
    off();
    resetTrail();
    const drive = game.hooks.sceneDrive;
    if (game.hooks.scene) { current = 0; applyScene(game.hooks.scene); enterScene(game.hooks.scene, game); return; } // escena fija (Viaje)
    if (game.hooks.spectate || (!drive && (!app.settings.scenes || SKIP.has(app.modeId)))) return;
    start = drive === 'journey' ? 0 : Math.floor(Math.random() * SCENES.length);
    current = sceneIndex(game, start);
    applyScene(SCENES[current]);
    enterScene(SCENES[current], game);
  });
  on('score', update);
  on('sceneStep', update);
  on('menu', off);
}
