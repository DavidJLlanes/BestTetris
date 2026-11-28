export const TILE = 512;
const LAYERS = [
  { count: 170, size: [0.4, 1.0], alpha: [0.25, 0.6], par: 0.12 },
  { count: 70, size: [0.7, 1.5], alpha: [0.4, 0.85], par: 0.3 },
  { count: 22, size: [1.2, 2.2], alpha: [0.6, 1], par: 0.55 },
];
const TINTS = ['#ffffff', '#cfe3ff', '#ffe9c7', '#e3d4ff'];
let tiles = null, tileDpr = 0;

/** Tres capas de estrellas pre-dibujadas en baldosas que se repiten (lejanas, medias y cercanas). */
export function starTiles(dpr) {
  if (tiles && tileDpr === dpr) return tiles;
  tileDpr = dpr;
  tiles = LAYERS.map((L) => {
    const c = document.createElement('canvas');
    c.width = c.height = Math.round(TILE * dpr);
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    for (let i = 0; i < L.count; i++) {
      const r = L.size[0] + Math.random() * (L.size[1] - L.size[0]);
      ctx.globalAlpha = L.alpha[0] + Math.random() * (L.alpha[1] - L.alpha[0]);
      ctx.fillStyle = TINTS[i % TINTS.length];
      ctx.beginPath();
      ctx.arc(Math.random() * TILE, Math.random() * TILE, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return { canvas: c, par: L.par };
  });
  return tiles;
}
