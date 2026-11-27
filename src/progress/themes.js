/**
 * Temas desbloqueables por nivel del jugador. `level` es el nivel necesario.
 * Añadir un tema es añadir una entrada (y su paleta, fondo o estilo musical).
 */
export const THEMES = {
  gems: {
    title: 'Gemas', setting: 'gems',
    list: [
      { id: 'prisma', name: 'Prisma', level: 1 }, { id: 'neon', name: 'Neón', level: 3 },
      { id: 'pastel', name: 'Pastel', level: 6 }, { id: 'oro', name: 'Oro viejo', level: 10 },
      { id: 'oceano', name: 'Océano', level: 15 }, { id: 'volcan', name: 'Volcán', level: 22 },
    ],
  },
  bg: {
    title: 'Fondos', setting: 'bg',
    list: [
      { id: 'aurora', name: 'Aurora', level: 1, colors: ['#5a1fff', '#ff2fb4', '#00b3d9'] },
      { id: 'abismo', name: 'Abismo', level: 4, colors: ['#0a2a8f', '#0b6aa0', '#1d4fa8'] },
      { id: 'atardecer', name: 'Atardecer', level: 8, colors: ['#ff7b00', '#ff2a6d', '#8a2be2'] },
      { id: 'bosque', name: 'Bosque', level: 12, colors: ['#138a5a', '#3aa38a', '#6b8f1d'] },
      { id: 'cosmos', name: 'Cosmos', level: 20, colors: ['#2b0a5a', '#ff00e6', '#ffd34f'] },
    ],
  },
  musicStyle: {
    title: 'Música', setting: 'musicStyle',
    list: [
      { id: 'cascada', name: 'Luz en cascada', level: 1 }, { id: 'nocturno', name: 'Nocturno', level: 5 },
      { id: 'arcade', name: 'Recreativa', level: 9 }, { id: 'cristal', name: 'Cristal', level: 14 },
    ],
  },
};

export const isUnlocked = (theme, level) => level >= theme.level;
