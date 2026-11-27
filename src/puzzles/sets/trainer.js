/**
 * Entrenador: cada pieza tiene una silueta donde debe acabar.
 * targets: { rot, x } cae recto; { rot, x, y } exige girar al final.
 */
export default {
  id: 'trainer',
  name: 'Entrenador',
  puzzles: [
    { id: 'e1', name: 'Base plana', hint: 'Construye una base sin huecos y deja un pozo a la derecha.', pieces: 'IIOO', hold: false, goal: { type: 'place' },
      board: [], targets: [{ rot: 0, x: 0 }, { rot: 0, x: 0 }, { rot: 0, x: 4 }, { rot: 0, x: 6 }] },
    { id: 'e2', name: 'Giro-T guiado', hint: 'Lleva la T a la silueta: tendrás que girarla dentro.', pieces: 'T', hold: false, goal: { type: 'place' },
      board: ['GGG..GGGGG', 'GGG...GGGG', 'GGGG.GGGGG'], targets: [{ rot: 2, x: 3, y: 19 }] },
  ],
};
