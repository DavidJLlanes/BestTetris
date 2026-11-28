import { deepMax } from './deepMax.js';

/**
 * Viaje: estrellas, marcas, partidas, polvo ganado y gastado, poderes comprados y usados se
 * quedan con el mayor de cada lado (nunca se pierde una estrella). El combustible, el modo calma
 * y la última constelación visitada son de cada dispositivo.
 */
export function mergeJourney(a, b) {
  if (!a || !b) return a || b;
  const out = deepMax(a, b);
  out.fuel = a.fuel ?? b.fuel ?? null;
  out.calm = a.calm ?? b.calm ?? false;
  out.at = a.at ?? b.at ?? null;
  return out;
}
