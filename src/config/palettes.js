/**
 * Paletas de gemas: [color claro, color oscuro] por tipo.
 * "daltonico" usa la paleta de Okabe-Ito, distinguible con los tipos de daltonismo más comunes.
 */
const SHARED = {
  X: ['#8a86b8', '#4a4675'], G: ['#6f6a99', '#36325c'],
  M: ['#ffffff', '#a9a6d6'], B: ['#ff3355', '#5a0018'], P: ['#ffe08a', '#d4567a'],
};

export const PALETTES = {
  prisma: {
    I: ['#46e6ff', '#0a8fb8'], O: ['#ffd34f', '#c98a00'], T: ['#c07bff', '#6c2bd9'], S: ['#5cff9d', '#11a85a'],
    Z: ['#ff5c7a', '#c01e45'], J: ['#5c8bff', '#2440c9'], L: ['#ff9d4f', '#cc5a0b'], ...SHARED,
  },
  neon: {
    I: ['#00fff0', '#008f99'], O: ['#fff200', '#a89c00'], T: ['#ff00e6', '#8a0080'], S: ['#39ff14', '#138a00'],
    Z: ['#ff2a6d', '#99003a'], J: ['#2d6bff', '#0a2a99'], L: ['#ff7b00', '#994500'], ...SHARED,
  },
  pastel: {
    I: ['#b5f2ff', '#6fb8d1'], O: ['#fff1b0', '#d6c06b'], T: ['#e3c7ff', '#a586d9'], S: ['#c4ffd8', '#7cc99a'],
    Z: ['#ffc4d0', '#d98a9b'], J: ['#c4d3ff', '#7f93d6'], L: ['#ffd8b5', '#d9a273'], ...SHARED,
  },
  oro: {
    I: ['#fff3c4', '#b8902a'], O: ['#ffe27a', '#a37a10'], T: ['#f5d0a0', '#9a6a2a'], S: ['#f0e6b0', '#8f8236'],
    Z: ['#ffcf9a', '#a0582a'], J: ['#e6d9a8', '#7d6a35'], L: ['#ffd98a', '#a8741c'], ...SHARED,
  },
  oceano: {
    I: ['#7ff7ff', '#1d8fa8'], O: ['#bdf3ff', '#4c9fc2'], T: ['#6fb7ff', '#1d4fa8'], S: ['#5cffd6', '#0f9c80'],
    Z: ['#8fa8ff', '#3a47b8'], J: ['#3fd0ff', '#0b6aa0'], L: ['#a7ffe8', '#3aa38a'], ...SHARED,
  },
  volcan: {
    I: ['#ffb347', '#b8430b'], O: ['#ffe066', '#c27200'], T: ['#ff5e3a', '#8f1a0a'], S: ['#ffcf6b', '#b06a00'],
    Z: ['#ff3d3d', '#7a0a0a'], J: ['#ff8a5c', '#a3330f'], L: ['#ffd1a3', '#b55c1c'], ...SHARED,
  },
  daltonico: {
    I: ['#8fd3ff', '#3a8fc4'], O: ['#fff27a', '#c7b92a'], T: ['#e39bc6', '#a8508a'], S: ['#33c59a', '#007a58'],
    Z: ['#ff8a4c', '#b34a00'], J: ['#4a9de0', '#00508a'], L: ['#ffc04d', '#c27f00'], ...SHARED,
  },
};
