import { takeSnapshot } from './takeSnapshot.js';

const KEEP = 8; // jugadas que se pueden deshacer seguidas como mucho

/** Apunta la foto de la pieza que acaba de aparecer (solo en modos con deshacer). */
export function recordSnapshot(g) {
  if (!g.rules.undo) return;
  g.history.push(takeSnapshot(g));
  if (g.history.length > KEEP + 1) g.history.shift();
}
