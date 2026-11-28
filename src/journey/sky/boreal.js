/** Tramo 1 · Cielo boreal. Estrellas en un cuadro 100×100 [x, y, brillo 1-3] y trazos entre ellas. */
export default [
  { id: 'osa-menor', name: 'Osa Menor', story: 'Su cola termina en la Estrella Polar, la que no se mueve: la brújula de los viajeros desde hace milenios.',
    stars: [[14, 14, 3], [30, 25, 1], [44, 37, 1], [58, 50, 1], [60, 72, 1], [86, 80, 2], [86, 55, 3]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
  { id: 'casiopea', name: 'Casiopea', story: 'La reina vanidosa, sentada en su trono, dibuja una W que gira toda la noche alrededor del polo.',
    stars: [[8, 34, 2], [30, 70, 3], [50, 44, 3], [70, 70, 2], [92, 30, 2]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { id: 'cefeo', name: 'Cefeo', story: 'El rey, esposo de Casiopea, parece una casita de tejado puntiagudo junto a la Osa Menor.',
    stars: [[50, 8, 2], [20, 45, 2], [80, 40, 3], [25, 88, 2], [75, 90, 2]], lines: [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]] },
  { id: 'lince', name: 'Lince', story: 'Tan tenue que, decían, hacían falta ojos de lince para verla. Una cadena de luces tímidas.',
    stars: [[10, 88, 3], [28, 72, 2], [42, 56, 1], [56, 44, 1], [72, 30, 1], [90, 12, 2]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
  { id: 'osa-mayor', name: 'Osa Mayor', story: 'Su carro de siete estrellas señala el norte: alarga la línea de las dos últimas y llegas a la Polar.',
    stars: [[5, 55, 2], [20, 42, 2], [33, 38, 2], [48, 40, 2], [52, 62, 2], [80, 66, 3], [82, 40, 3]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]] },
  { id: 'dragon', name: 'Dragón', boss: true, story: 'El guardián de las manzanas de oro se enrosca entre las dos osas. Su cabeza vigila el cielo del norte.',
    stars: [[78, 12, 2], [90, 20, 3], [85, 32, 2], [72, 25, 2], [60, 38, 1], [62, 55, 2], [45, 62, 1], [30, 50, 2], [18, 62, 1], [15, 80, 1], [32, 90, 2]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10]] },
];
