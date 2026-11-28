import { pad } from './state.js';

/** Lo último que se supo del mando, para ?diag: sirve para ver qué llega de un mando real. */
export const padStatus = { error: '', frames: 0, lastInput: '', connects: 0, disconnects: 0 };
addEventListener('gamepadconnected', () => padStatus.connects++);
addEventListener('gamepaddisconnected', () => padStatus.disconnects++);

/** Texto de una línea con el estado del mando. */
export function padLine() {
  if (!navigator.getGamepads) return 'mando: este navegador no tiene Gamepad API';
  const raw = Array.from(navigator.getGamepads());
  const all = raw.filter(Boolean);
  const head = `mandos: ${all.length}/${raw.length} ranuras  conectar ${padStatus.connects}  desconectar ${padStatus.disconnects}  ventana ${document.hasFocus() ? 'activa' : 'SIN FOCO'}`;
  if (!all.length) return `${head}\nmando: ninguno (pulsa un botón del mando)`;
  return head + '\n' + all.map(slot).join('\n') + (padStatus.error ? `\nerror mando: ${padStatus.error}` : '');
}

function slot(gp) {
  const on = gp.buttons.map((b, i) => (b.pressed || b.value > 0.5 ? i : -1)).filter((i) => i >= 0).join(',') || '—';
  const ax = gp.axes.slice(0, 4).map((a) => a.toFixed(1)).join(' ');
  return `mando ${gp.index}${gp.index === pad.index ? '*' : ''} ${gp.id.slice(0, 32)} [${gp.mapping || 'sin mapeo'}] bot ${on} ejes ${ax} lecturas ${padStatus.frames}`;
}
