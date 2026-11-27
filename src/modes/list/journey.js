/**
 * Viaje: un álbum jugable. Cinco escenas seguidas, diez líneas cada una; con cada escena cambian
 * la luz, el ambiente y la música, y la velocidad sube. Al final, el recorrido entero.
 */
export default {
  id: 'journey',
  order: 1.5,
  name: 'Viaje',
  description: 'Cinco escenas, una tras otra',
  icon: '✧',
  record: 'score',
  sceneDrive: 'journey',
  rules: { goalLines: 50, undo: 3, undoCost: 1000, star: true },
};
