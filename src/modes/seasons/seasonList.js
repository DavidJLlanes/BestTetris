/**
 * Las cuatro estaciones del modo Estaciones. Cada una tiene su luz, su ambiente,
 * su tonalidad musical y una regla propia que cambia la forma de jugar.
 */
export const SEASONS = [
  { id: 'spring', name: 'Primavera', rule: 'Todo florece: juego normal', tint: '#5cff9d', particle: 'petal', transpose: 0, rules: { ghost: true, fixedInterval: 0.8 } },
  { id: 'summer', name: 'Verano', rule: 'El calor acelera la caída', tint: '#ffd34f', particle: 'firefly', transpose: 5, rules: { ghost: true, fixedInterval: 0.35 } },
  { id: 'autumn', name: 'Otoño', rule: 'Caen hojas: sube una fila de roca', tint: '#ff9d4f', particle: 'leaf', transpose: 3, rules: { ghost: true, fixedInterval: 0.6 }, enter: 'garbage' },
  { id: 'winter', name: 'Invierno', rule: 'La niebla oculta la pieza fantasma', tint: '#8fd3ff', particle: 'snow', transpose: -2, rules: { ghost: false, fixedInterval: 0.7 } },
];

export const LINES_PER_SEASON = 10;
export const seasonFor = (lines) => SEASONS[Math.floor(lines / LINES_PER_SEASON) % SEASONS.length];
export const yearFor = (lines) => Math.floor(lines / (LINES_PER_SEASON * SEASONS.length)) + 1;
