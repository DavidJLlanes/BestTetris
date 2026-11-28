import { map } from './mapState.js';
import { project } from './project.js';
import { nodeSprite, SPRITE_PAD } from './nodeSprite.js';
import { nodeStatus } from './nodeStatus.js';
import { drawNodeMarks } from './drawNodeMarks.js';

const P = {};

/**
 * Paradas del mapa, de la más lejana a la más cercana (las cercanas tapan a las lejanas).
 * Cada una es su sprite escalado con la perspectiva y, encima, sus estrellas y su nombre.
 */
export function drawNodes(ctx) {
  map.hit.length = 0;
  const res = map.spriteRes;
  for (const n of map.drawOrder) {
    project(n.x, n.y, P);
    const R = n.r * P.s;
    if (P.y < -R * 3 || P.y > map.h + R * 3) continue;
    const st = map.celebrate && map.celebrate.id === n.id && map.celebrate.hideLit ? { state: 'open', stars: 0 } : nodeStatus(n);
    const sprite = nodeSprite(n, st.state, res);
    const size = n.r * 2 * SPRITE_PAD * P.s;
    const pop = map.pops[n.id] || 0; // rebote al abrirse
    const k = 1 + pop * 0.25 * Math.sin(Math.min(1, pop) * Math.PI);
    ctx.drawImage(sprite, P.x - (size * k) / 2, P.y - (size * k) / 2, size * k, size * k);
    drawNodeMarks(ctx, n, st, P, R);
    map.hit.push({ node: n, x: P.x, y: P.y, r: R });
  }
}
