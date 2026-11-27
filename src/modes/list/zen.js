/** Zen: sin prisa y sin final. Si se llena el tablero, se vacía y sigues. */
export default {
  id: 'zen',
  order: 10,
  name: 'Zen',
  description: 'Sin prisa y sin final',
  icon: '☯',
  record: 'score',
  rules: { levelUp: false, fixedInterval: 1.0, endsOnTopOut: false, undo: Infinity, undoCost: 250, star: true },
};
