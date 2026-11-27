/**
 * Los 5 movimientos 3D del logotipo. Cada uno recibe el avance p (0..1) y el tiempo t en
 * segundos, y devuelve giro global extra { rx, ry } y, por bloque, un desplazamiento [dx, dy, dz].
 */
const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const env = (p) => Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
const bounce = (p) => {
  const n = 7.5625, d = 2.75;
  if (p < 1 / d) return n * p * p;
  if (p < 2 / d) return n * (p -= 1.5 / d) * p + 0.75;
  if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + 0.9375;
  return n * (p -= 2.625 / d) * p + 0.984375;
};
const back = (p) => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;

export const ANIMATIONS = [
  { // 1. Giro completo sobre su eje
    name: 'giro', dur: 1.9,
    global: (p) => ({ rx: 0, ry: ease(p) * Math.PI * 2 }),
    block: () => null,
  },
  { // 2. Ola que recorre las letras en profundidad
    name: 'ola', dur: 2.4,
    global: () => ({ rx: 0, ry: 0 }),
    block: (b, p, t) => { const w = Math.sin(t * 7 - b.hx * 0.38) * env(p); return [0, w * -0.6, w * 4.5]; },
  },
  { // 3. Explosión y reensamblaje
    name: 'explosion', dur: 2.2,
    global: (p) => ({ rx: env(p) * 0.25, ry: env(p) * 0.35 }),
    block: (b, p) => {
      if (!b.dir) { const a = Math.random() * Math.PI * 2, z = Math.random() * 2 - 1, r = Math.sqrt(1 - z * z); b.dir = [Math.cos(a) * r, Math.sin(a) * r, z]; b.far = 8 + Math.random() * 10; }
      const k = p < 0.32 ? 1 - (1 - p / 0.32) ** 3 : 1 - back(Math.min(1, (p - 0.32) / 0.68));
      return b.dir.map((c) => c * b.far * k);
    },
  },
  { // 4. Balanceo en perspectiva
    name: 'balanceo', dur: 2.8,
    global: (p) => ({ rx: Math.sin(p * Math.PI * 3) * 0.42 * env(p), ry: Math.sin(p * Math.PI * 2) * 0.75 * env(p) }),
    block: () => null,
  },
  { // 5. Las letras saltan, caen una a una y encajan con rebote
    name: 'caida', dur: 2.3,
    global: () => ({ rx: 0, ry: 0 }),
    block: (b, p) => {
      const start = b.letter * 0.05;
      if (p < start + 0.22) { const u = Math.max(0, (p - start) / 0.22); return [0, -18 * u * u, 0]; }
      const u = Math.min(1, (p - start - 0.22) / 0.42);
      return [0, -18 * (1 - bounce(u)), 0];
    },
  },
];
