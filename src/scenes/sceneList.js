/**
 * Escenas propias de BestTris: cada una con su luz (3 colores del fondo), sus partículas de
 * ambiente y su arreglo musical. Durante la partida se suceden según las líneas hechas.
 */
export const SCENES = [
  { id: 'cristal', name: 'Océano de cristal', colors: ['#1440ff', '#00c2d6', '#6b5cff'], particle: 'bubble', tint: '#9fe8ff', style: 'cristal', transpose: 0 },
  { id: 'neon', name: 'Ciudad de neón', colors: ['#ff2fb4', '#7a2bff', '#00e0ff'], particle: 'rain', tint: '#ff9bea', style: 'arcade', transpose: 2 },
  { id: 'luciernagas', name: 'Bosque de luciérnagas', colors: ['#0f7a4d', '#2fbf71', '#9bdc3c'], particle: 'firefly', tint: '#e8ff8a', style: 'nocturno', transpose: -2 },
  { id: 'polar', name: 'Cielo polar', colors: ['#2ee6a8', '#6a5cff', '#1a9fff'], particle: 'snow', tint: '#dff6ff', style: 'cascada', transpose: 0 },
  { id: 'brasas', name: 'Desierto de brasas', colors: ['#ff7b00', '#ff2a6d', '#ffb13d'], particle: 'ember', tint: '#ffc07a', style: 'cascada', transpose: 3 },
];
/** Líneas que dura cada escena antes de dar paso a la siguiente. */
export const LINES_PER_SCENE = 8;
/** Modo Viaje: líneas de cada escena (5 escenas × 10 = 50 líneas, como un álbum de 5 temas). */
export const JOURNEY_LINES = 10;
/** Modo Deriva: segundos que dura cada escena (cambian con el tiempo, no con las líneas). */
export const DRIFT_SECS = 90;
