import { boardToRows } from './boardRows.js';

/**
 * Grabación de una partida: el tablero inicial, cada pieza fijada [t, tipo, giro, x, y]
 * y el avance [t, líneas, puntos] para la carrera contra el fantasma.
 */
export function createRecorder(g) {
  return { v: 1, mode: g.mode, start: boardToRows(g.board), events: [], track: [[0, 0, 0]], valid: true };
}

export function recordLock(rec, g, p) { rec.events.push([round(g.time), p.type, p.rot, p.x, p.y]); }
export function recordProgress(rec, g) { rec.track.push([round(g.time), g.lines, g.score]); }

const round = (t) => Math.round(t * 1000) / 1000;
