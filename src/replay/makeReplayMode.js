import { parseBoard } from '../puzzles/parseBoard.js';
import { ghostY } from '../core/movement/ghostY.js';
import { hardDrop } from '../core/game/hardDrop.js';
import { lockPiece } from '../core/game/lockPiece.js';

/**
 * Modo espectador que reproduce una grabación: cada pieza aparece arriba y, en su momento,
 * cae a donde la dejó el jugador. No hay controles, récords ni logros.
 */
export function makeReplayMode(replay, base) {
  return {
    id: 'replay',
    spectate: true,
    noRecord: true,
    achievementCategory: 'none',
    countdown: 1,
    name: `Repetición · ${base.name}`,
    icon: '▶',
    record: base.record,
    rules: { ...base.rules, fixedInterval: 1e9, hold: false, undo: 0, garbageRows: 0, timeLimit: null },
    setup(g) {
      parseBoard(g.board, replay.start);
      g.custom.types = replay.events.map((e) => e[1]);
      g.custom.i = 0;
    },
    nextPiece: (g) => g.custom.types.shift() || null,
    isComplete: (g) => g.custom.i >= replay.events.length,
    progress: base.progress,
    onTick(g) {
      const e = replay.events[g.custom.i];
      if (!e || !g.cur || g.clearing || g.time < e[0]) return;
      g.custom.i++;
      Object.assign(g.cur, { rot: e[2], x: e[3] });
      if (ghostY(g) === e[4]) hardDrop(g);
      else { g.cur.y = e[4]; lockPiece(g, true); }
    },
  };
}
