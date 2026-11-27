import { app } from '../app/state.js';

let waiting = false;

/** Recarga para mostrar el progreso traído de otro dispositivo, pero nunca en mitad de una partida. */
export function reloadOnMenu() {
  if (app.screen === 'menu') { location.reload(); return; }
  if (waiting) return;
  waiting = true;
  setInterval(() => { if (app.screen === 'menu') location.reload(); }, 1000);
}
