import { SCENES, LINES_PER_SCENE, JOURNEY_LINES, DRIFT_SECS } from './sceneList.js';

/**
 * Qué escena toca ahora según cómo las recorra el modo (mode.sceneDrive):
 * 'journey' en orden, una cada JOURNEY_LINES líneas; 'drift' con el tiempo;
 * por defecto, desde una al azar y una nueva cada LINES_PER_SCENE líneas.
 */
export function sceneIndex(g, start) {
  const n = SCENES.length;
  const drive = g.hooks.sceneDrive;
  if (drive === 'journey') return Math.min(n - 1, Math.floor(g.lines / JOURNEY_LINES));
  if (drive === 'drift') return (start + Math.floor(g.time / DRIFT_SECS)) % n;
  return (start + Math.floor(g.lines / LINES_PER_SCENE)) % n;
}
