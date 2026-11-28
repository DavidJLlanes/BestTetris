import { TRAMOS } from './tramos.js';
import boreal from './sky/boreal.js';
import primavera from './sky/primavera.js';
import verano from './sky/verano.js';
import otono from './sky/otono.js';
import invierno from './sky/invierno.js';
import sur from './sky/sur.js';
import abismo from './sky/abismo.js';
import corazon from './sky/corazon.js';
import hiddenSky from './sky/hidden.js';
import eventSky from './sky/events.js';
import { LEVEL_SPECS, HIDDEN_SPECS, EVENT_SPECS } from './levels/index.js';

const SKY = [boreal, primavera, verano, otono, invierno, sur, abismo, corazon];
/** Posición en su tramo de la constelación de la que sale el desvío oculto (la tercera). */
export const BRANCH_AT = 2;

const make = (sky, spec, extra) => ({ id: sky.id, sky, spec, challenges: spec.ch, ...extra });

/** Las 48 constelaciones del camino, de la primera a la última. La sexta de cada tramo es su jefe. */
export const MAIN = SKY.flatMap((list, tramo) => list.map((sky, i) => make(sky, LEVEL_SPECS[tramo][sky.id], {
  kind: sky.boss ? 'boss' : 'main', tramo, pos: i, num: tramo * 6 + i + 1,
})));

/** Las 8 ocultas: cada una cuelga de la tercera constelación de su tramo. */
export const HIDDEN = hiddenSky.map((sky) => make(sky, HIDDEN_SPECS[sky.id], {
  kind: 'hidden', tramo: sky.tramo, pos: BRANCH_AT + 0.5, num: null, branchFrom: MAIN[sky.tramo * 6 + BRANCH_AT].id,
}));

/** Las de la lluvia de estrellas: una por semana, fuera del camino. */
export const EVENTS = eventSky.map((sky) => make(sky, EVENT_SPECS[sky.id], { kind: 'event', tramo: null, num: null }));

export const ALL_LEVELS = [...MAIN, ...HIDDEN, ...EVENTS];
export const getLevel = (id) => ALL_LEVELS.find((l) => l.id === id);
export const tramoOf = (level) => TRAMOS[level.tramo ?? 3];
/** Total de constelaciones oficiales del cielo: el Viaje irá ampliándose hasta ellas. */
export const SKY_TOTAL = 88;
