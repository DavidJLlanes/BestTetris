/** Contadores de los elementos del Viaje en la partida (g.custom.j). Siempre datos simples: deshacer los copia. */
export function newCounters() {
  return { astros: 0, dust: 0, ice: 0, shooting: 0, holes: 0, comets: 0, multi: 0, start: { astros: 0, dust: 0, ice: 0, holes: 0, rock: 0 } };
}

/** Lo recogido de un elemento en esta partida. */
export const got = (g, key) => (g.custom.j ? g.custom.j[key] : 0);
