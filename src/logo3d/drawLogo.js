/**
 * Pinta el logotipo como cubos de verdad: cada bloque gira con el conjunto, se proyecta en
 * perspectiva y sus caras visibles se iluminan según hacia dónde miran (luz arriba-izquierda-delante).
 * La cara frontal lleva el brillo facetado de las gemas del juego.
 */
const H = 0.43; // medio lado del cubo (deja una junta fina entre bloques)
const LIGHT = norm([-0.35, -0.5, -0.8]);
const FACES = [ // normal y sus 4 esquinas
  { n: [0, 0, -1], c: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]] },
  { n: [0, 0, 1], c: [[1, -1, 1], [-1, -1, 1], [-1, 1, 1], [1, 1, 1]] },
  { n: [-1, 0, 0], c: [[-1, -1, 1], [-1, -1, -1], [-1, 1, -1], [-1, 1, 1]] },
  { n: [1, 0, 0], c: [[1, -1, -1], [1, -1, 1], [1, 1, 1], [1, 1, -1]] },
  { n: [0, -1, 0], c: [[-1, -1, 1], [1, -1, 1], [1, -1, -1], [-1, -1, -1]] },
  { n: [0, 1, 0], c: [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]] },
];

// Faceta brillante de la cara de delante (como la de las gemas del tablero)
const FACET = [[-0.72, -0.72, -1.01], [0.72, -0.72, -1.01], [0.45, -0.08, -1.01], [-0.45, -0.08, -1.01]];

function norm(v) { const l = Math.hypot(...v); return v.map((c) => c / l); }

function rotator(rx, ry) {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  return ([x, y, z]) => {
    const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
    return [x1, y * cx - z1 * sx, y * sx + z1 * cx];
  };
}

export function drawLogo(L) {
  const { ctx, w, h, dpr, blocks, k, rx, ry, cam } = L;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const rot = rotator(rx, ry);
  const cx = w / 2, cy = h / 2;
  const proj = ([x, y, z]) => { const s = (k * cam) / (cam + z); return [cx + x * s, cy + y * s]; };
  const faces = FACES.map((f) => ({ n: rot(f.n), c: f.c.map((v) => rot(v.map((q) => q * H))) }));
  const facet = FACET.map((v) => rot(v.map((q) => q * H)));
  const items = blocks.map((b) => {
    const p = rot([b.hx + b.ax + b.d[0], b.hy + b.ay + b.d[1], b.hz + b.az + b.d[2]]);
    return { b, p };
  }).sort((a, b) => b.p[2] - a.p[2]);

  for (const { b, p } of items) {
    for (let i = 0; i < faces.length; i++) {
      const f = faces[i];
      const view = [-p[0], -p[1], -cam - p[2]];
      if (f.n[0] * view[0] + f.n[1] * view[1] + f.n[2] * view[2] <= 0) continue;
      const lit = Math.max(0, f.n[0] * LIGHT[0] + f.n[1] * LIGHT[1] + f.n[2] * LIGHT[2]);
      const shade = 0.36 + 0.8 * lit;
      const [r, g, bl] = b.rgb;
      ctx.fillStyle = `rgb(${Math.min(255, Math.round(r * shade))},${Math.min(255, Math.round(g * shade))},${Math.min(255, Math.round(bl * shade))})`;
      ctx.beginPath();
      f.c.forEach((v, j) => { const [sx, sy] = proj([p[0] + v[0], p[1] + v[1], p[2] + v[2]]); if (j) ctx.lineTo(sx, sy); else ctx.moveTo(sx, sy); });
      ctx.closePath();
      ctx.fill();
      if (i === 0 && lit > 0.3) { // faceta brillante de gema en la cara de delante
        ctx.fillStyle = `rgba(255,255,255,${(0.12 + lit * 0.3).toFixed(2)})`;
        ctx.beginPath();
        facet.forEach((v, j) => { const [sx, sy] = proj([p[0] + v[0], p[1] + v[1], p[2] + v[2]]); if (j) ctx.lineTo(sx, sy); else ctx.moveTo(sx, sy); });
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}
