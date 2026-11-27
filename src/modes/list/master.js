/** Maestro: las piezas caen al instante desde el principio. Solo cuenta tu precisión. */
export default {
  id: 'master',
  order: 6,
  name: 'Maestro',
  description: 'Gravedad instantánea, 100 líneas',
  icon: '♛',
  record: 'time',
  rules: { levelUp: false, fixedInterval: 0.001, goalLines: 100 },
};
