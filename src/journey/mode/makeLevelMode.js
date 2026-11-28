import { goalOf } from '../goals/list.js';
import { tramoOf } from '../catalog.js';
import { levelRules } from './levelRules.js';
import { setupLevel } from './setupLevel.js';
import { tickLevel } from './tickLevel.js';
import { filterRows } from '../elements/filterRows.js';
import { resolveClear } from '../elements/resolveClear.js';
import { cometStrike, cometNext } from '../elements/comet.js';
import { drawCosmic } from '../render/drawCosmic.js';
import { bestLabelFor } from '../progress/bestLabelFor.js';

/**
 * Convierte una constelación en un modo de juego. bag: los poderes que el jugador lleva.
 * Se identifica como 'journey' (récords, logros y fantasma van por constelación con recordKey).
 */
export function makeLevelMode(level, bag = []) {
  const goal = goalOf(level.spec.goal), t = tramoOf(level);
  return {
    id: 'journey',
    level,
    name: level.sky.name,
    icon: '✧',
    record: 'score',
    replay: true, // el mejor intento corre como fantasma
    overPanel: 'ov-jresult', // su propia pantalla de resultado, con estrellas
    countdown: 3,
    powers: bag.length > 0,
    progressLabel: goal.label,
    recordKey: () => `journey-${level.id}`,
    bestLabel: () => bestLabelFor(level),
    scene: { id: `j-${t.id}`, name: t.name, colors: t.colors, particle: t.particle, tint: t.tint, style: t.style, transpose: t.transpose },
    rules: levelRules(level),
    setup: (g) => setupLevel(g, level, bag),
    onTick: (g, dt) => tickLevel(g, dt, level),
    nextPiece: cometNext,
    onLock: cometStrike,
    filterRows,
    resolveClear,
    isComplete: (g) => goal.done(g, level.spec.goal),
    progress: (g) => goal.progress(g, level.spec.goal),
    drawLayer: drawCosmic,
  };
}
