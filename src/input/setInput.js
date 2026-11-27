import { app } from '../app/state.js';
import { emit } from '../app/bus.js';

/** Recuerda el último tipo de control usado (para pistas y textos de ayuda). */
export function setInput(kind) {
  if (app.lastInput === kind) return;
  app.lastInput = kind;
  emit('inputChange', { kind });
}
