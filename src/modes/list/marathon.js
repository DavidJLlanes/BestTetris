/** Maratón: el clásico. La velocidad sube cada 10 líneas y no hay final. */
export default {
  id: 'marathon',
  order: 1,
  name: 'Maratón',
  description: 'Sube de nivel cada 10 líneas',
  icon: '∞',
  record: 'score',
  rules: { undo: 3, undoCost: 1000, star: true }, // 3 deshaceres: 1000, 2000 y 3000 puntos
};
