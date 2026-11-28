import { MAIN, HIDDEN, EVENTS } from '../../journey/catalog.js';
import { TRAMOS } from '../../journey/tramos.js';
import { totalStars, maxStars, wonCount, starsOf } from '../../journey/progress/stars.js';

/**
 * Logros del Viaje. Casi todos se comprueban con el evento 'journey' (tras apuntar el resultado),
 * que trae { result, progress }; los de compras y de compartir llegan con sus propios eventos.
 */
const P = ({ data }) => data.progress;
const R = ({ data }) => data.result;
const bossOf = (t) => MAIN[t * 6 + 5];
const BOSS = [
  ['Domador de dragones', 'bronze'], ['Mil cabezas', 'bronze'], ['Fuerza de héroe', 'silver'], ['Mar en calma', 'silver'],
  ['Cazador cazado', 'gold'], ['Discípulo del centauro', 'gold'], ['Sin miedo al aguijón', 'prism'], ['Sanador de estrellas', 'prism'],
];
const total = (k, n) => (ctx) => ((P(ctx).totals || {})[k] || 0) >= n;
const tramoPerfect = (p) => TRAMOS.some((_, t) => MAIN.slice(t * 6, t * 6 + 6).every((l) => starsOf(p, l.id) === 3));

export default [
  { id: 'j-first', name: 'Primera luz', desc: 'Completa tu primera constelación del Viaje', tier: 'bronze', icon: '✧', on: 'journey', test: (c) => R(c).won },
  ...BOSS.map(([name, tier], t) => ({ id: `j-boss-${t + 1}`, name, desc: `Vence a ${bossOf(t).sky.name}, el jefe de ${TRAMOS[t].name}`, tier, icon: '♛', on: 'journey', test: (c) => starsOf(P(c), bossOf(t).id) > 0 })),
  { id: 'j-path-12', name: 'Rumbo fijo', desc: 'Completa 12 constelaciones del camino', tier: 'bronze', icon: '☄', on: 'journey', test: (c) => wonCount(P(c), MAIN) >= 12 },
  { id: 'j-path-24', name: 'Medio cielo', desc: 'Completa 24 constelaciones del camino', tier: 'silver', icon: '☄', on: 'journey', test: (c) => wonCount(P(c), MAIN) >= 24 },
  { id: 'j-path-48', name: 'Fin del camino', desc: 'Completa las 48 constelaciones del camino', tier: 'gold', icon: '☄', on: 'journey', test: (c) => wonCount(P(c), MAIN) >= 48 },
  { id: 'j-map-56', name: 'Cartógrafo del cielo', desc: 'Completa las 48 del camino y las 8 ocultas', tier: 'prism', icon: '🗺', on: 'journey', test: (c) => wonCount(P(c), [...MAIN, ...HIDDEN]) >= 56 },
  { id: 'j-3', name: 'Brillo pleno', desc: 'Consigue 3 estrellas en una constelación', tier: 'bronze', icon: '★', on: 'journey', test: (c) => R(c).stars === 3 },
  { id: 'j-stars-30', name: 'Puñado de estrellas', desc: 'Reúne 30 estrellas en el Viaje', tier: 'bronze', icon: '★', on: 'journey', test: (c) => totalStars(P(c)) >= 30 },
  { id: 'j-stars-80', name: 'Constelado', desc: 'Reúne 80 estrellas en el Viaje', tier: 'silver', icon: '★', on: 'journey', test: (c) => totalStars(P(c)) >= 80 },
  { id: 'j-stars-130', name: 'Firmamento', desc: 'Reúne 130 estrellas en el Viaje', tier: 'gold', icon: '★', on: 'journey', test: (c) => totalStars(P(c)) >= 130 },
  { id: 'j-stars-max', name: 'Perfección celeste', desc: 'Todas las estrellas del Viaje (3 en cada constelación)', tier: 'prism', icon: '✪', on: 'journey', test: (c) => totalStars(P(c)) >= maxStars() },
  { id: 'j-tramo-3', name: 'Tramo perfecto', desc: 'Las 6 constelaciones de un tramo con 3 estrellas', tier: 'gold', icon: '✪', on: 'journey', test: (c) => tramoPerfect(P(c)) },
  { id: 'j-hidden-1', name: 'Explorador', desc: 'Completa una constelación oculta', tier: 'silver', icon: '?', on: 'journey', test: (c) => R(c).won && R(c).level.kind === 'hidden' },
  { id: 'j-hidden-8', name: 'Mapa secreto', desc: 'Completa las 8 constelaciones ocultas', tier: 'prism', icon: '?', on: 'journey', test: (c) => wonCount(P(c), HIDDEN) >= 8 },
  { id: 'j-event', name: 'Lluvia de estrellas', desc: 'Completa la constelación de una lluvia de estrellas', tier: 'silver', icon: '☔', on: 'journey', test: (c) => R(c).won && R(c).level.kind === 'event' },
  { id: 'j-event-3', name: 'Bajo la lluvia', desc: '3 estrellas en una lluvia de estrellas', tier: 'gold', icon: '☔', on: 'journey', test: (c) => R(c).stars === 3 && R(c).level.kind === 'event' },
  { id: 'j-events-4', name: 'Cazador de lluvias', desc: 'Completa 4 lluvias de estrellas distintas', tier: 'gold', icon: '☔', on: 'journey', test: (c) => wonCount(P(c), EVENTS) >= 4 },
  { id: 'j-astros', name: 'Recolector de astros', desc: 'Recoge 50 astros', tier: 'silver', icon: '★', on: 'journey', test: total('astros', 50) },
  { id: 'j-dust', name: 'Picapedrero cósmico', desc: 'Rompe 50 bloques de polvo cósmico', tier: 'silver', icon: '◌', on: 'journey', test: total('dust', 50) },
  { id: 'j-ice', name: 'Deshielo', desc: 'Funde 50 bloques de hielo', tier: 'silver', icon: '❄', on: 'journey', test: total('ice', 50) },
  { id: 'j-shooting', name: 'Ojo de lince', desc: 'Atrapa 25 estrellas fugaces', tier: 'gold', icon: '✦', on: 'journey', test: total('shooting', 25) },
  { id: 'j-holes', name: 'Horizonte de sucesos', desc: 'Cierra 20 agujeros negros', tier: 'gold', icon: '●', on: 'journey', test: total('holes', 20) },
  { id: 'j-comets', name: 'Lluvia de cometas', desc: 'Lanza 30 cometas', tier: 'silver', icon: '☄', on: 'journey', test: total('comets', 30) },
  { id: 'j-catch-3', name: 'Tres deseos', desc: 'Atrapa 3 estrellas fugaces en una partida', tier: 'bronze', icon: '✦', on: 'journey', test: ({ data }) => (data.game.custom.j || {}).shooting >= 3 },
  { id: 'j-boss-clean', name: 'Sin un rasguño', desc: 'Vence a un jefe con 3 estrellas y sin deshacer', tier: 'gold', icon: '♛', on: 'journey', test: (c) => R(c).level.kind === 'boss' && R(c).stars === 3 && !c.data.game.stats.undos },
  { id: 'j-boss-fast', name: 'Golpe certero', desc: 'Vence a un jefe en menos de 2:00', tier: 'gold', icon: '⚡', on: 'journey', test: (c) => R(c).won && R(c).level.kind === 'boss' && c.data.game.time < 120 },
  { id: 'j-streak-10', name: 'Racha cósmica', desc: 'Gana 10 constelaciones seguidas sin perder ninguna', tier: 'gold', icon: '∞', on: 'journey', test: (c) => (P(c).bestStreak || 0) >= 10 },
  { id: 'j-calm', name: 'Paseo tranquilo', desc: 'Completa una constelación en modo calma', tier: 'bronze', icon: '☾', on: 'journey', test: (c) => R(c).won && P(c).calm },
  { id: 'j-power', name: 'Con una ayudita', desc: 'Usa un poder de la tienda en el Viaje', tier: 'bronze', icon: '✦', on: 'journey', test: ({ data }) => (data.game.stats.powers || 0) > 0 },
  { id: 'j-dust-1000', name: 'Rico en polvo', desc: 'Gana 1.000 de polvo estelar en total', tier: 'silver', icon: '✦', on: 'journey', test: (c) => (P(c).earned || 0) >= 1000 },
  { id: 'j-buy', name: 'Primera compra', desc: 'Compra algo en un planeta tienda', tier: 'bronze', icon: '🪐', on: 'journeyBuy', test: () => true },
  { id: 'j-share', name: 'Mapa compartido', desc: 'Comparte la tarjeta de tu viaje', tier: 'bronze', icon: '↗', on: 'journeyShare', test: () => true },
];
