import { DEFAULT_RULES } from '../../config/rules.js';
import { createBoard } from '../board/createBoard.js';
import { createBag } from '../randomizer/createBag.js';
import { seedGarbage } from './seedGarbage.js';
import { fillQueue } from './fillQueue.js';

const QUEUE_SIZE = 6;
const noop = () => {};

/**
 * Estado de una partida para un modo (ver src/modes). Todo lo que pasa se comunica
 * con emit(evento, datos), así el núcleo no sabe nada de sonido, pantalla ni controles.
 */
export function createGame(mode, { emit = noop, rng = null } = {}) {
  const rules = { ...DEFAULT_RULES, ...mode.rules };
  const random = rng || (mode.createRng ? mode.createRng() : Math.random);
  const next = createBag(random);
  const g = {
    mode: mode.id,
    hooks: mode,
    rules,
    random,
    board: createBoard(),
    next,
    queue: [],
    cur: null, hold: null, holdUsed: false,
    score: 0, lines: 0, level: rules.startLevel, combo: -1, b2b: false,
    time: 0, gravAcc: 0, lockTimer: 0, resets: 0, lowestY: 0,
    lastRotate: false, lastKick: 0,
    softDrop: false,
    clearing: null,
    over: false, won: false,
    custom: {}, // estado libre para los modos
    history: [], // fotos para deshacer (solo si rules.undo)
    stats: { pieces: 0, quads: 0, tspins: 0, maxCombo: 0, perfectClears: 0, holds: 0, b2bMax: 0, b2bChain: 0, undos: 0, undoPoints: 0 },
    emit,
  };
  seedGarbage(g, rules.garbageRows);
  if (mode.setup) mode.setup(g);
  fillQueue(g, QUEUE_SIZE);
  return g;
}
