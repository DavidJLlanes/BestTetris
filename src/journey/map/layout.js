import { MAIN, HIDDEN } from '../catalog.js';
import { TRAMOS } from '../tramos.js';

/** Medidas del mapa en unidades de diseño (se escalan con la pantalla). */
export const SPACING = 170; // distancia vertical entre constelaciones
export const TRAMO_GAP = 90; // hueco extra al cruzar a otro tramo (el portal)
const XS = [0, 92, -96, -40, 86, 0]; // posición lateral según el puesto en el tramo (el jefe, centrado)
const RADIUS = { main: 34, boss: 46, hidden: 30, shop: 28 };

/**
 * Coloca en el mundo todas las paradas: las 48 del camino subiendo en zigzag, las ocultas a un lado
 * de la tercera de cada tramo y los planetas tienda junto a cada jefe. y crece hacia arriba.
 */
export function layoutNodes() {
  const nodes = [];
  MAIN.forEach((level, i) => {
    const y = i * SPACING + level.tramo * TRAMO_GAP;
    nodes.push({ id: level.id, kind: level.kind, level, tramo: level.tramo, x: XS[level.pos], y, r: RADIUS[level.kind] });
  });
  HIDDEN.forEach((level) => {
    const from = nodes.find((n) => n.id === level.branchFrom);
    nodes.push({ id: level.id, kind: 'hidden', level, tramo: level.tramo, from: from.id, x: 150, y: from.y + SPACING * 0.55, r: RADIUS.hidden });
  });
  TRAMOS.forEach((t, i) => {
    if (!t.planet) return;
    const boss = nodes.find((n) => n.level && n.level.tramo === i && n.kind === 'boss');
    nodes.push({ id: `shop-${i}`, kind: 'shop', tramo: i, from: boss.id, planet: t.planet, x: i % 2 ? -150 : 150, y: boss.y + SPACING * 0.45, r: RADIUS.shop });
  });
  return nodes;
}

/** Altura del mundo de arriba abajo (para los límites de la cámara). */
export const worldTop = (nodes) => Math.max(...nodes.map((n) => n.y)) + SPACING;

/** y donde empieza cada tramo (para su nombre en el cielo y el portal de estrellas). */
export const tramoStart = (t) => t * 6 * SPACING + t * TRAMO_GAP;
