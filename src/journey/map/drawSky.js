import { map } from './mapState.js';
import { starTiles, TILE } from './starTiles.js';
import { skyColors } from './skyColor.js';
import { drawNebulae } from './drawNebulae.js';
import { drawStreaks } from './drawStreaks.js';

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/**
 * Fondo del espacio: negro profundo teñido con los colores del tramo, nebulosas en profundidad y
 * tres capas de estrellas que se mueven a distinta velocidad (paralaje), más algún destello fugaz.
 */
export function drawSky(ctx, dt) {
  const { w, h } = map;
  const [c1, c2] = skyColors(map.cam.y);
  ctx.fillStyle = '#04021a';
  ctx.fillRect(0, 0, w, h);
  const top = ctx.createLinearGradient(0, 0, 0, h);
  top.addColorStop(0, rgba(c1, 0.32));
  top.addColorStop(0.55, rgba(c2, 0.08));
  top.addColorStop(1, rgba(c2, 0.26));
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, w, h);
  drawNebulae(ctx);
  const tiles = starTiles(map.tileDpr);
  for (const t of tiles) {
    const off = ((map.cam.y * t.par * map.k) % TILE + TILE) % TILE;
    for (let y = -TILE + off; y < h; y += TILE) for (let x = 0; x < w; x += TILE) ctx.drawImage(t.canvas, x, y, TILE, TILE);
  }
  drawStreaks(ctx, dt);
}
