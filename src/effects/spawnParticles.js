import { fx } from './state.js';

/** Añade n chispas en (x, y), en celdas del tablero visible. */
export function spawnParticles(x, y, color, n = 3, { speed = 4, life = null, size = null, vx = null, vy = null } = {}) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = speed * (0.4 + Math.random());
    fx.particles.push({
      x, y, color,
      vx: vx ?? Math.cos(a) * sp,
      vy: vy ?? Math.sin(a) * sp - 2,
      life: life ?? 0.6 + Math.random() * 0.5,
      size: size ?? 2 + Math.random() * 3,
    });
  }
}
