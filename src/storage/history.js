import { load, save } from './store.js';

const KEEP = 400;

/** Últimas partidas, para las gráficas de evolución: [fecha, modo, puntos, líneas, segundos, ganada]. */
export const loadHistory = () => load('history', []);

export function addHistory(g) {
  const list = loadHistory();
  list.push([Date.now(), g.mode, g.score, g.lines, Math.round(g.time * 100) / 100, g.won ? 1 : 0]);
  save('history', list.slice(-KEEP));
}
