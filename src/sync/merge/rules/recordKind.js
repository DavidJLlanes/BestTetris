import { MODES } from '../../../modes/registry.js';
import { RECORD_KINDS } from '../../../modes/recordKinds.js';

/** Cómo se compara el récord de una clave ("marathon", "daily-2026-11-27"…). */
export function recordKind(key) {
  const mode = MODES.find((m) => m.id === key) || MODES.find((m) => m.id === key.split('-')[0]);
  return RECORD_KINDS[(mode && mode.record) || 'score'];
}
