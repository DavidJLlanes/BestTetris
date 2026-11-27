/**
 * Catálogo completo de logros. Para añadir logros: añade entradas a un archivo de
 * ./catalog/ o crea uno nuevo y añádelo aquí. El motor y la vitrina los recogen solos.
 */
import lines from './catalog/lines.js';
import technique from './catalog/technique.js';
import scoring from './catalog/scoring.js';
import modes from './catalog/modes.js';
import lifetime from './catalog/lifetime.js';
import secrets from './catalog/secrets.js';

export const CATEGORIES = [
  { id: 'lines', name: 'Líneas', list: lines },
  { id: 'technique', name: 'Técnica', list: technique },
  { id: 'scoring', name: 'Puntuación', list: scoring },
  { id: 'modes', name: 'Modos', list: modes },
  { id: 'lifetime', name: 'Constancia', list: lifetime },
  { id: 'secrets', name: 'Secretos', list: secrets },
];

export const ACHIEVEMENTS = CATEGORIES.flatMap((c) => c.list.map((a) => ({ ...a, category: c.id })));
