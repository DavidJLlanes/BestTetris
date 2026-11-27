import { fx } from '../effects/state.js';
import { setMusicStyle, setMusicTranspose } from '../audio/index.js';

/**
 * Pone una escena: los colores del fondo cambian con un fundido largo (CSS), las partículas
 * de la escena anterior se desvanecen mientras entran las nuevas y la música cambia de arreglo.
 */
export function applyScene(scene) {
  const body = document.body;
  scene.colors.forEach((c, i) => body.style.setProperty(`--au${i + 1}`, c));
  body.dataset.scene = scene.id;
  if (fx.ambient && fx.ambient.kind !== scene.particle) fx.ambientOut = fx.ambient;
  fx.ambient = { kind: scene.particle, color: scene.tint, parts: null, fade: 0 };
  setMusicStyle(scene.style);
  setMusicTranspose(scene.transpose);
}
