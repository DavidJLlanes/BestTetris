import { fx } from './state.js';
import { damp } from '../util/damp.js';
import { stepSpring } from '../util/spring.js';

export const TEXT_LIFE = 1.4;
const GRAVITY = 14;

/** Avanza todas las animaciones decorativas. */
export function updateEffects(dt) {
  for (const p of fx.particles) { p.life -= dt; p.vy += GRAVITY * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
  fx.particles = fx.particles.filter((p) => p.life > 0);
  for (const t of fx.texts) t.t += dt;
  fx.texts = fx.texts.filter((t) => t.t < TEXT_LIFE);
  for (const t of fx.trails) t.t += dt;
  fx.trails = fx.trails.filter((t) => t.t < t.life);
  if (fx.lockFlash) { fx.lockFlash.t -= dt; if (fx.lockFlash.t <= 0) fx.lockFlash = null; }
  fx.levelFlash = Math.max(0, fx.levelFlash - dt * 1.5);
  fx.shake = damp(fx.shake, 0, 12, dt);
  stepSpring(fx.bounce, dt);
  stepSpring(fx.zoom, dt, 160, 16);
  if (fx.slow) { fx.slow.t -= dt; if (fx.slow.t <= 0) fx.slow = null; }
  fx.rewind = Math.max(0, fx.rewind - dt * 2.2);
  fx.overT += dt;
  fx.rowOffsets = fx.rowOffsets.map((o) => damp(o, 0, 18, dt)).map((o) => (o < 0.01 ? 0 : o));
}
