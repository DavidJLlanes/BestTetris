/** Ultra: la máxima puntuación en dos minutos. */
export default {
  id: 'ultra',
  order: 3,
  name: 'Ultra',
  description: 'Máxima puntuación en 2 minutos',
  icon: '⚡',
  record: 'score',
  replay: true, // se graba y el mejor intento corre como fantasma
  rules: { levelUp: false, timeLimit: 120, star: true },
};
