import { MAIN, HIDDEN } from '../catalog.js';

const of = (p, id) => (p.levels[id] ? p.levels[id].stars : 0);

/** Estrellas de una constelación. */
export const starsOf = of;

/** Estrellas del camino y de las ocultas (las de evento no abren tramos). */
export const totalStars = (p) => [...MAIN, ...HIDDEN].reduce((s, l) => s + of(p, l.id), 0);

/** Estrellas posibles: 3 por constelación del camino y oculta. */
export const maxStars = () => (MAIN.length + HIDDEN.length) * 3;

/** Constelaciones ganadas (al menos 1 estrella), de cualquier tipo. */
export const wonCount = (p, list) => list.filter((l) => of(p, l.id) > 0).length;
