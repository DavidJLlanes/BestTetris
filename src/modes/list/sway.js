/**
 * Vaivén: la gravedad va y viene en oleadas. Calma para construir, ráfaga para aguantar.
 * Cada ciclo completo, todas las fases son un poco más rápidas.
 */
export const SWAY_PHASES = [
  { id: 'calm', name: 'Calma', secs: 12, interval: 1.0, color: '#5cff9d' },
  { id: 'breeze', name: 'Brisa', secs: 8, interval: 0.3, color: '#46e6ff' },
  { id: 'gust', name: '¡Ráfaga!', secs: 5, interval: 0.05, color: '#ff5c7a' },
];
const FASTER = 0.92;
const WARN = 1.5; // segundos de aviso antes de cada cambio

export default {
  id: 'sway',
  order: 7.6,
  name: 'Vaivén',
  description: 'La gravedad sube y baja por oleadas',
  icon: '〰',
  record: 'score',
  rules: { levelUp: false, fixedInterval: SWAY_PHASES[0].interval },
  setup(g) { Object.assign(g.custom, { phase: 0, t: 0, cycle: 0, warned: false }); },
  onTick(g, dt) {
    const c = g.custom, phase = SWAY_PHASES[c.phase];
    c.t += dt;
    if (!c.warned && c.t >= phase.secs - WARN) { c.warned = true; g.emit('swayWarn', { next: SWAY_PHASES[(c.phase + 1) % SWAY_PHASES.length] }); }
    if (c.t < phase.secs) return;
    c.t = 0; c.warned = false;
    c.phase = (c.phase + 1) % SWAY_PHASES.length;
    if (c.phase === 0) c.cycle++;
    const next = SWAY_PHASES[c.phase];
    g.rules.fixedInterval = next.interval * Math.pow(FASTER, c.cycle);
    g.emit('swayPhase', { phase: next, cycle: c.cycle });
  },
};
