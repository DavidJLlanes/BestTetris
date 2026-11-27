import { createGame } from '../src/core/game/createGame.js';
import { getMode } from '../src/modes/registry.js';

/** Partida de prueba con eventos registrados y generador aleatorio fijo. */
export function testGame(mode = 'marathon') {
  const events = [];
  let seed = 1;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const g = createGame(getMode(mode), { emit: (name, data) => events.push({ name, data }), rng });
  return { g, events, names: () => events.map((e) => e.name) };
}

/** Rellena filas completas del tablero dejando huecos en las columnas indicadas. */
export function fillRows(board, fromY, toY, holes = []) {
  for (let y = fromY; y <= toY; y++) for (let x = 0; x < 10; x++) board[y][x] = holes.includes(x) ? null : 'J';
}
