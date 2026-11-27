/**
 * Color, luz y movimiento propios de cada modo: dos colores para su cristal y su icono, y la
 * mini animación del icono (pulse, spin, float, tick, flick o glint).
 */
export const MODE_STYLE = {
  tutorial: ['#46e6ff', '#7a8bff', 'pulse'],
  marathon: ['#9a7bff', '#ff5fdc', 'glint'],
  journey: ['#46e6ff', '#ff5fdc', 'float'],
  sprint: ['#3dffb0', '#00c2ff', 'tick'],
  ultra: ['#ffd23d', '#ff7b00', 'flick'],
  dig: ['#ffb070', '#ff7b3d', 'tick'],
  tide: ['#1a9fff', '#00e0ff', 'float'],
  master: ['#ffd76a', '#ff9d2f', 'glint'],
  shadow: ['#b9b4ff', '#6c66a8', 'pulse'],
  purist: ['#e8f4ff', '#8fd8ff', 'glint'],
  daily: ['#ffb13d', '#ff5f6d', 'spin'],
  zen: ['#2fbf71', '#9bdc3c', 'spin'],
  drift: ['#8d7bff', '#2ee6a8', 'float'],
  seasons: ['#ff9b2f', '#ffd04d', 'float'],
  sway: ['#00c2d6', '#6b5cff', 'float'],
  chaos: ['#ff2a6d', '#ff9b2f', 'spin'],
  powers: ['#c27bff', '#ff5fdc', 'pulse'],
  puzzles: ['#5cff9d', '#46e6ff', 'glint'],
};

export const modeStyle = (id) => MODE_STYLE[id] || ['#9a7bff', '#46e6ff', 'glint'];
