import { editor } from './editorState.js';

/** Convierte el borrador del editor en un puzle jugable. */
export function buildEditorPuzzle() {
  const goal = editor.goal === 'perfect' ? { type: 'perfect' } : { type: editor.goal, n: Math.max(1, Math.round(+editor.n || 1)) };
  return { id: 'custom', custom: true, fromEditor: true, name: editor.name.trim() || 'Mi puzle', board: editor.rows.slice(), pieces: editor.pieces, goal, hold: editor.hold, hint: 'Tu propio puzle' };
}
