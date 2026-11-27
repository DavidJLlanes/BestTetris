/**
 * Decoración del fondo y del tablero. Cada pieza se puede apagar en Ajustes.
 * La calidad decide cuántas partículas y a qué ritmo se anima el polvo de luz.
 */
export const DECOR_PARTS = [
  { id: 'orbs', name: 'Orbes de luz' },
  { id: 'dust', name: 'Polvo de luz y destellos' },
  { id: 'facets', name: 'Facetas de prisma' },
  { id: 'frame', name: 'Marco de cristal del tablero' },
  { id: 'mark', name: 'Logotipo tras el tablero' },
  { id: 'grain', name: 'Grano y viñeta' },
  { id: 'live', name: 'Fondo que late con la música y las jugadas' },
  { id: 'tilt', name: 'Profundidad al mover el móvil o el ratón' },
];

export const QUALITY = {
  high: { dust: 70, fps: 60, blur: true, dpr: 1.5, particles: 1 },
  medium: { dust: 36, fps: 30, blur: false, dpr: 1, particles: 0.6 },
  low: { dust: 0, fps: 0, blur: false, dpr: 1, particles: 0.3 },
};
export const QUALITY_NAMES = { auto: 'Automática', high: 'Alta', medium: 'Media', low: 'Baja' };
export const AUTO_START = 'high';
