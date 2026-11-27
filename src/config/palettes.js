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
  daltonico: {
    I: ['#8fd3ff', '#3a8fc4'], O: ['#fff27a', '#c7b92a'], T: ['#e39bc6', '#a8508a'], S: ['#33c59a', '#007a58'],
    Z: ['#ff8a4c', '#b34a00'], J: ['#4a9de0', '#00508a'], L: ['#ffc04d', '#c27f00'], ...SHARED,
  },
};
