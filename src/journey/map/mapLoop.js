import { map } from './mapState.js';
import { updateCamera } from './camera.js';
import { drawSky } from './drawSky.js';
import { drawPath, drawSpurs } from './drawPath.js';
import { drawPortals } from './drawPortals.js';
import { drawNodes } from './drawNodes.js';
import { drawShip } from './drawShip.js';
import { updateShip } from './ship/updateShip.js';
import { targetAngle } from './ship/targetAngle.js';
import { followShip } from './ship/followShip.js';
import { followCamera } from './followCamera.js';
import { drawParticles } from './particles.js';
import { updateCelebration, drawCelebration } from './celebrate.js';
import { nodeStatus } from './nodeStatus.js';
import { resizeMap } from './resizeMap.js';

const ZOOM_EASE = 6.5;
const spurOpen = (n) => nodeStatus(n).state !== 'locked';

function step(dt) {
  map.time += dt;
  const before = map.cam.y;
  updateCamera(dt);
  followCamera(before);
  map.zoom += (map.zoomTo - map.zoom) * (1 - Math.exp(-ZOOM_EASE * dt));
  if (map.zoomTo === 1 && map.zoom > 0.9 && map.zoomDone) { const f = map.zoomDone; map.zoomDone = null; f(); }
  updateShip(dt, targetAngle());
  followShip(dt);
  for (const id of Object.keys(map.pops)) { map.pops[id] += dt * 2.2; if (map.pops[id] >= 1) delete map.pops[id]; }
  updateCelebration(dt);
}

function draw(dt) {
  const ctx = map.ctx;
  ctx.setTransform(map.dpr, 0, 0, map.dpr, 0, 0);
  drawSky(ctx, dt);
  drawPortals(ctx);
  drawPath(ctx);
  drawSpurs(ctx, spurOpen);
  drawNodes(ctx);
  drawCelebration(ctx);
  drawShip(ctx);
  drawParticles(ctx, dt);
}

/** Si el dispositivo no llega a 60 fps, baja la densidad del lienzo (una vez cada poco). */
function adapt(dt) {
  map.slowFrames = dt > 0.024 ? map.slowFrames + 1 : Math.max(0, map.slowFrames - 0.5);
  if (map.slowFrames > 45 && (map.quality || 1) > 0.6) { map.slowFrames = 0; resizeMap((map.quality || 1) * 0.8); }
}

function frame(now) {
  if (!map.running) return;
  const dt = Math.min(0.05, (now - map.last) / 1000 || 0);
  map.last = now;
  step(dt);
  draw(dt);
  if (map.onFrame) map.onFrame(dt);
  adapt(dt);
  if (map.isVisible()) requestAnimationFrame(frame);
  else map.running = false;
}

/** Arranca el bucle del mapa (se para solo cuando el mapa deja de verse). */
export function runMap() {
  if (map.running) return;
  map.running = true;
  map.last = performance.now();
  requestAnimationFrame(frame);
}
