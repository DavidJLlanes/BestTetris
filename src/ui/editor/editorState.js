import { load, save } from '../../storage/store.js';

/** Borrador del editor. Se guarda en el navegador para no perderlo al probar o recargar. */
export const ED_ROWS = 12;
const emptyRows = () => Array.from({ length: ED_ROWS }, () => '..........');
const FRESH = () => ({ name: 'Mi puzle', rows: emptyRows(), pieces: 'T', goal: 'lines', n: 1, hold: false, brush: 'G' });

export const editor = { ...FRESH(), ...load('editorDraft', {}) };
if (!Array.isArray(editor.rows) || editor.rows.length !== ED_ROWS) editor.rows = emptyRows();

export const saveDraft = () => save('editorDraft', editor);
export function resetDraft() { Object.assign(editor, FRESH(), { brush: editor.brush }); saveDraft(); }
