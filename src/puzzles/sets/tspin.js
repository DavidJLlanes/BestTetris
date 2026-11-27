/** Puzles de giros-T: hay que girar la T dentro del hueco en el último momento. */
export default {
  id: 'tspin',
  name: 'Giros-T',
  puzzles: [
    { id: 't1', name: 'Giro sencillo', hint: 'Baja la T de lado y gírala al tocar fondo.', pieces: 'T', goal: { type: 'tspin', n: 1 },
      board: ['GGG..GGGGG', 'GGG...GGGG', 'GGGG.GGGG.'] },
    { id: 't2', name: 'Giro doble', hint: 'El mismo truco, pero limpiando dos líneas.', pieces: 'T', goal: { type: 'tspin', n: 2 },
      board: ['GGG..GGGGG', 'GGG...GGGG', 'GGGG.GGGGG'] },
    { id: 't3', name: 'Espejo', hint: 'Ahora el saliente está al otro lado.', pieces: 'T', goal: { type: 'tspin', n: 2 },
      board: ['GGGGG..GGG', 'GGGG...GGG', 'GGGGG.GGGG'] },
    { id: 't4', name: 'Prepara y gira', hint: 'Usa la primera pieza para cerrar el techo.', pieces: 'OT', goal: { type: 'tspin', n: 2 },
      board: ['GG........', 'GGG...GGGG', 'GGGG.GGGGG'] },
  ],
};
