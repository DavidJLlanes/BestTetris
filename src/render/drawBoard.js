import { view } from './view.js';
import { fx } from '../effects/state.js';
import { drawBackdrop } from './layers/drawBackdrop.js';
import { drawDanger } from './layers/drawDanger.js';
import { drawFlash } from './layers/drawFlash.js';
import { drawStack } from './layers/drawStack.js';
import { drawGhost } from './layers/drawGhost.js';
import { drawTarget } from './layers/drawTarget.js';
import { drawRewind } from './layers/drawRewind.js';
import { drawActive } from './layers/drawActive.js';
import { drawLockFlash } from './layers/drawLockFlash.js';
import { drawTrails } from './layers/drawTrails.js';
import { drawParticles } from './layers/drawParticles.js';
import { drawTexts } from './layers/drawTexts.js';

/** Compone el tablero por capas, de atrás hacia delante. */
export function drawBoard(g, settings, now) {
  const ctx = view.board;
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, view.width, view.height);
  drawBackdrop(ctx, settings);
  if (g) drawDanger(ctx, g, now);
  drawFlash(ctx);

  ctx.save();
  const shake = fx.shake > 0.2 ? (Math.random() - 0.5) * fx.shake : 0;
  ctx.translate(shake, fx.bounce.x);
  if (fx.zoom.x) {
    const z = 1 + fx.zoom.x, cx = view.width / 2, cy = view.height / 2;
    ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
  }
  if (g) {
    drawTrails(ctx);
    drawStack(ctx, g);
    if (g.cur && !g.over) {
      drawTarget(ctx, g, now);
      if (settings.ghost) drawGhost(ctx, g);
      drawActive(ctx, g);
    }
    drawLockFlash(ctx);
    drawRewind(ctx);
  }
  drawParticles(ctx);
  ctx.restore();
  drawTexts(ctx);
}
