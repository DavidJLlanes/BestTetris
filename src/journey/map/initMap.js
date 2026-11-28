import { map } from './mapState.js';
import { layoutNodes, worldTop } from './layout.js';
import { spline } from './spline.js';
import { bindDragInput } from './dragInput.js';
import { resizeMap } from './resizeMap.js';

/** Prepara el mapa una vez: paradas, camino, lienzo y gestos. onTap recibe la parada tocada. */
export function initMap(canvas, { onTap, isVisible }) {
  map.canvas = canvas;
  map.ctx = canvas.getContext('2d', { alpha: false });
  map.isVisible = isVisible;
  map.nodes = layoutNodes();
  map.byId = Object.fromEntries(map.nodes.map((n) => [n.id, n]));
  map.drawOrder = [...map.nodes].sort((a, b) => b.y - a.y);
  map.path = spline(map.nodes.filter((n) => n.kind === 'main' || n.kind === 'boss'));
  map.top = worldTop(map.nodes);
  bindDragInput(canvas, onTap);
  addEventListener('resize', () => { if (isVisible()) resizeMap(); });
}
