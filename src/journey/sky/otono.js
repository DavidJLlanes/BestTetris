/** Tramo 4 · Mares de otoño. */
export default [
  { id: 'triangulo', name: 'Triángulo', story: 'Tres estrellas y nada más: los griegos la llamaban Delta por su forma. Esconde una galaxia espiral.',
    stars: [[15, 75, 2], [85, 55, 2], [60, 20, 2]], lines: [[0, 1], [1, 2], [2, 0]] },
  { id: 'aries', name: 'Aries', story: 'El carnero del vellocino de oro. Hace dos mil años el Sol empezaba en él la primavera.',
    stars: [[38, 66, 1], [45, 50, 2], [78, 36, 3], [94, 55, 1]], lines: [[0, 1], [1, 2], [2, 3]] },
  { id: 'piscis', name: 'Piscis', story: 'Dos peces atados por una cinta, Afrodita y Eros escapando del monstruo Tifón.',
    stars: [[80, 64, 1], [90, 74, 1], [82, 88, 1], [70, 80, 1], [36, 94, 2], [25, 50, 1], [30, 22, 1], [20, 8, 1]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6], [6, 7]] },
  { id: 'andromeda', name: 'Andrómeda', story: 'La princesa encadenada. Junto a ella se ve a simple vista la galaxia más lejana que alcanzan tus ojos.',
    stars: [[8, 62, 3], [28, 56, 2], [50, 50, 3], [86, 34, 3], [46, 30, 1], [52, 14, 1]], lines: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5]] },
  { id: 'pegaso', name: 'Pegaso', story: 'El caballo alado nacido de Medusa. Su gran cuadrado es el mapa del cielo de otoño.',
    stars: [[18, 20, 3], [58, 20, 2], [58, 56, 2], [18, 56, 2], [78, 66, 1], [95, 86, 2], [78, 10, 1], [95, 18, 1]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [4, 5], [1, 6], [6, 7]] },
  { id: 'ballena', name: 'Ballena', boss: true, story: 'El monstruo marino que iba a devorar a Andrómeda. En su cuello late Mira, una estrella que se apaga y se enciende.',
    stars: [[80, 18, 2], [92, 28, 2], [86, 42, 1], [72, 34, 2], [60, 50, 1], [50, 62, 2], [30, 60, 1], [14, 74, 2], [24, 90, 1], [46, 86, 2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 5]] },
];
