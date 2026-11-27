import { HIDDEN, ROWS } from '../config/board.js';
import { highestRow } from '../core/board/highestRow.js';
import { setMusicTension } from '../audio/index.js';

const EVERY = 0.25; // segundos entre actualizaciones
let acc = 0;

/** Tensión musical 0..1 según lo alta que está la pila y el combo en curso. */
export function updateMusicTension(g, dt) {
  acc += dt;
  if (acc < EVERY || !g) return;
  acc = 0;
  const height = (HIDDEN + ROWS - highestRow(g.board)) / ROWS; // 0 vacío … 1 lleno
  const stack = Math.max(0, Math.min(1, (height - 0.35) / 0.5));
  const combo = Math.min(0.4, Math.max(0, g.combo) * 0.08);
  setMusicTension(Math.min(1, stack + combo));
}
