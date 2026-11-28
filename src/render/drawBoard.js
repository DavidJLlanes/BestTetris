import { view } from './view.js';
import { fx } from '../effects/state.js';
import { drawBackdrop } from './layers/drawBackdrop.js';
import { drawDanger } from './layers/drawDanger.js';
import { drawFlash } from './layers/drawFlash.js';
import { drawStack } from './layers/drawStack.js';
import { drawGhost } from './layers/drawGhost.js';
import { drawTarget } from './layers/drawTarget.js';
import { drawRewind } from './layers/drawRewind.js';
import { drawRace } from './layers/drawRace.js';
import { drawAmbient } from './layers/drawAmbient.js';
import { drawFrost } from './layers/drawFrost.js';
import { drawActive } from './layers/drawActive.js';
import { drawLockFlash } from './layers/drawLockFlash.js';
import { drawTrails } from './layers/drawTrails.js';
import { drawParticles } from './layers/drawParticles.js';
import { drawTexts } from './layers/drawTexts.js';
import { drawAfterimages } from './layers/drawAfterimages.js';
import { drawRings } from './layers/drawRings.js';
import { drawSweeps } from './layers/drawSweeps.js';
import { drawStar } from './layers/drawStar.js';
import { musicPulse } from '../audio/index.js';

/** Compone el tablero por capas, de atrás hacia delante. */
export function drawBoard(g, settings, now) {
  const ctx = view.board;
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, view.width, view.height);
  drawBackdrop(ctx, settings);
  if (g) drawDanger(ctx, g, now);
  drawFlash(ctx);
  drawAmbient(ctx, now);

  ctx.save();
  const shake = fx.shake > 0.2 ? (Math.random() - 0.5) * fx.shake : 0;
  ctx.translate(shake, fx.bounce.x);
  // La cámara respira con el pulso de la música (muy leve; se apaga con Rebote y temblor)
  const breath = settings.shake && settings.particles ? musicPulse() * 0.005 : 0;
  if (fx.zoom.x || breath) {
    const z = 1 + fx.zoom.x + breath, cx = view.width / 2, cy = view.height / 2;
    ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy);
  }
  if (g) {
    drawTrails(ctx);
    drawStack(ctx, g);
    if (g.hooks.drawLayer) g.hooks.drawLayer(ctx, g, now); // capas propias del modo (elementos del Viaje)
    drawStar(ctx, g, now);
    drawAfterimages(ctx);
    if (g.cur && !g.over) {
      drawTarget(ctx, g, now);
      if (settings.ghost && g.rules.ghost) drawGhost(ctx, g);
      drawActive(ctx, g);
    }
    drawLockFlash(ctx);
    drawSweeps(ctx);
    drawRings(ctx);
    drawRewind(ctx);
  }
  drawParticles(ctx);
  ctx.restore();
  drawFrost(ctx, now);
  if (g) drawRace(ctx, g);
  drawTexts(ctx);
}
