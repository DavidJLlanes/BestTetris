import { PUZZLE_SETS, ALL_PUZZLES } from '../../puzzles/registry.js';

/** Logros de puzles. El perfil ya tiene apuntado el puzle resuelto cuando se comprueban. */
const solvedPuzzle = ({ g }) => g.mode === 'puzzle' && g.won;
const setDone = (id) => ({ profile }) => PUZZLE_SETS.find((s) => s.id === id).puzzles.every((p) => profile.puzzles[p.id] !== undefined);

export default [
  { id: 'puzzle-1', name: 'Primera pieza del puzle', desc: 'Resuelve un puzle', tier: 'bronze', icon: '🧩', on: 'finish', test: solvedPuzzle },
  { id: 'puzzle-quick', name: 'Golpe de vista', desc: 'Resuelve un puzle en menos de 4 segundos', tier: 'silver', icon: '👁', on: 'finish', test: ({ g }) => solvedPuzzle({ g }) && g.time < 4 },
  { id: 'puzzle-basics', name: 'Buenos cimientos', desc: 'Resuelve todos los puzles de Primeros pasos', tier: 'silver', icon: '🧱', on: 'finish', test: setDone('basics') },
  { id: 'puzzle-tspin', name: 'Bailarín', desc: 'Resuelve todos los puzles de Giros-T', tier: 'gold', icon: '🌀', on: 'finish', test: setDone('tspin') },
  { id: 'puzzle-trainer', name: 'Alumno aplicado', desc: 'Completa el Entrenador', tier: 'silver', icon: '🎯', on: 'finish', test: setDone('trainer') },
  { id: 'puzzle-all', name: 'Mente prismática', desc: 'Resuelve todos los puzles', tier: 'prism', icon: '💠', on: 'finish', test: ({ profile }) => ALL_PUZZLES.every((p) => profile.puzzles[p.id] !== undefined) },
  { id: 'puzzle-custom', name: 'De la comunidad', desc: 'Resuelve un puzle creado con el editor', tier: 'bronze', icon: '✉', on: 'finish', test: ({ g }) => solvedPuzzle({ g }) && g.hooks.puzzle.custom },
  { id: 'puzzle-custom-10', name: 'Coleccionista de retos', desc: 'Resuelve 10 puzles creados con el editor', tier: 'gold', icon: '✉', on: 'finish', test: ({ profile }) => profile.customSolved >= 10 },
];
