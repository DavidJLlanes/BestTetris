import { pad } from './state.js';

/** Lo último que se supo del mando, para ?diag: sirve para ver qué llega de un mando real. */
export const padStatus = { error: '', frames: 0, lastInput: '' };

/** Texto de una línea con el estado del mando. */
export function padLine() {
  const all = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : null;
  if (!all) return 'mando: este navegador no tiene Gamepad API';
  if (!all.length) return 'mando: ninguno (pulsa un botón del mando)';
  return all.map(slot).join('\n') + (padStatus.error ? `\nerror mando: ${padStatus.error}` : '');
}

function slot(gp) {
  const on = gp.buttons.map((b, i) => (b.pressed || b.value > 0.5 ? i : -1)).filter((i) => i >= 0).join(',') || '—';
  const ax = gp.axes.slice(0, 4).map((a) => a.toFixed(1)).join(' ');
  return `mando ${gp.index}${gp.index === pad.index ? '*' : ''} ${gp.id.slice(0, 32)} [${gp.mapping || 'sin mapeo'}] bot ${on} ejes ${ax} lecturas ${padStatus.frames}`;
}
