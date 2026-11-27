import { load, save } from './store.js';
import { loadIdentity } from './identity.js';

const KEEP = 400;

/** Últimas partidas, para gráficas y clasificación: [fecha, modo, puntos, líneas, segundos, ganada, deshizo, nombre]. */
export const loadHistory = () => load('history', []);

export function addHistory(g) {
  const list = loadHistory();
  list.push([Date.now(), g.mode, g.score, g.lines, Math.round(g.time * 100) / 100, g.won ? 1 : 0, g.stats.undos ? 1 : 0, loadIdentity().name]);
  save('history', list.slice(-KEEP));
}
