import boreal from './boreal.js';
import primavera from './primavera.js';
import verano from './verano.js';
import otono from './otono.js';
import invierno from './invierno.js';
import sur from './sur.js';
import abismo from './abismo.js';
import corazon from './corazon.js';
import hidden from './hidden.js';
import events from './events.js';

/** Niveles por tramo (mismo orden que src/journey/tramos.js), los ocultos y los de evento. */
export const LEVEL_SPECS = [boreal, primavera, verano, otono, invierno, sur, abismo, corazon];
export const HIDDEN_SPECS = hidden;
export const EVENT_SPECS = events;
