/** Puzles de iniciación: encajar y limpiar. */
export default {
  id: 'basics',
  name: 'Primeros pasos',
  puzzles: [
    { id: 'b1', name: 'Primer prisma', hint: 'La barra larga cabe de pie en el hueco.', pieces: 'I', goal: { type: 'lines', n: 4 },
      board: ['GGGGGGGGG.', 'GGGGGGGGG.', 'GGGGGGGGG.', 'GGGGGGGGG.'] },
    { id: 'b2', name: 'Doble cierre', hint: 'El cuadrado tapa los dos huecos a la vez.', pieces: 'O', goal: { type: 'lines', n: 2 },
      board: ['GGGG..GGGG', 'GGGG..GGGG'] },
    { id: 'b3', name: 'Dos cuadrados', hint: 'Un hueco de 4 de ancho: dos cuadrados juntos.', pieces: 'OO', goal: { type: 'lines', n: 2 },
      board: ['GG....GGGG', 'GG....GGGG'] },
    { id: 'b4', name: 'Escalón', hint: 'La pieza encaja justo en el escalón.', pieces: 'S', goal: { type: 'lines', n: 2 },
      board: ['GGGGG..GGG', 'GGGG..GGGG'] },
    { id: 'b5', name: 'Tablero limpio', hint: 'Si no queda nada, ¡bonus!', pieces: 'O', goal: { type: 'perfect' },
      board: ['GGGGGGGG..', 'GGGGGGGG..'] },
    { id: 'b6', name: 'Esquinas', hint: 'Las dos piezas en L se abrazan.', pieces: 'JL', goal: { type: 'lines', n: 2 },
      board: ['G.GGGGGG.G', 'G...GG...G'] },
    { id: 'b7', name: 'Pozo profundo', hint: 'Primero la barra, después lo demás.', pieces: 'IO', goal: { type: 'lines', n: 4 },
      board: ['GGGGGG..G.', 'GGGGGG..G.', 'GGGGGGGGG.', 'GGGGGGGGG.'] },
    { id: 'b8', name: 'Tres piezas', hint: 'Piensa en el orden antes de soltar.', pieces: 'TLJ', goal: { type: 'lines', n: 3 },
      board: ['GGG....GGG', 'GGG....GGG', 'GGGG.GGGGG'] },
  ],
};
