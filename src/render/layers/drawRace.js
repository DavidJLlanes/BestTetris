import { view } from '../view.js';
import { replayState } from '../../replay/watchReplay.js';
import { ghostAt } from '../../replay/ghostAt.js';

/** Barra fina en el borde derecho: tú (luz) contra tu fantasma (marca blanca) hacia la meta. */
export function drawRace(ctx, g) {
  const ghost = replayState.ghost;
  const goal = g.rules.goalLines;
  if (!ghost || !goal || g.hooks.spectate) return;
  const h = view.height, x = view.width - 4;
  const you = Math.min(1, g.lines / goal), them = Math.min(1, ghostAt(ghost, g.time).lines / goal);
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  ctx.fillRect(x, 0, 3, h);
  ctx.fillStyle = you >= them ? '#5cff9d' : '#46e6ff';
  ctx.fillRect(x, h * (1 - you), 3, h * you);
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.fillRect(x - 5, h * (1 - them) - 1, 10, 2);
}
