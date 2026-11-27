/** Logros de puntuación y nivel en una sola partida. */
const score = (id, name, n, tier) => ({ id, name, desc: `${n.toLocaleString('es-ES')} puntos en una partida`, tier, icon: '★', on: 'score', test: ({ g }) => g.score >= n });
const level = (id, name, n, tier) => ({ id, name, desc: `Llega al nivel ${n}`, tier, icon: '▲', on: 'levelUp', test: ({ g }) => g.level >= n });

export default [
  score('score-10k', 'Chispa', 10000, 'bronze'),
  score('score-50k', 'Destello', 50000, 'silver'),
  score('score-100k', 'Resplandor', 100000, 'silver'),
  score('score-250k', 'Supernova', 250000, 'gold'),
  score('score-1m', 'Millonario de luz', 1000000, 'prism'),
  level('level-5', 'Calentando', 5, 'bronze'),
  level('level-10', 'Velocidad de crucero', 10, 'silver'),
  level('level-15', 'Hiperespacio', 15, 'gold'),
  level('level-20', 'Más allá de la luz', 20, 'prism'),
];
