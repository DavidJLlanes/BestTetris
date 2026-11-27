import { HIDDEN } from '../../config/board.js';

/** Logros secretos: no se muestran hasta conseguirlos. */
export default [
  { id: 'edge', name: 'Al filo', desc: 'Limpia una línea con la pila tocando el techo', tier: 'gold', icon: '!', secret: true, on: 'clear', test: ({ g }) => g.board.slice(0, HIDDEN + 1).some((r) => r.some(Boolean)) },
  { id: 'indecisive', name: 'Indeciso', desc: 'Usa la reserva 50 veces en una partida', tier: 'bronze', icon: '?', secret: true, on: 'hold', test: ({ g }) => g.stats.holds >= 50 },
  { id: 'no-hold-100', name: 'Lo que venga', desc: '100 líneas sin usar la reserva', tier: 'gold', icon: '✋', secret: true, on: 'score', test: ({ g }) => g.lines >= 100 && g.stats.holds === 0 && g.rules.hold },
  { id: 'night-owl', name: 'Noctámbulo', desc: 'Juega entre las 2 y las 5 de la madrugada', tier: 'bronze', icon: '☾', secret: true, on: 'finish', test: () => { const h = new Date().getHours(); return h >= 2 && h < 5; } },
  { id: 'instant-loss', name: 'Despegue fallido', desc: 'Pierde en menos de 20 segundos', tier: 'bronze', icon: '✗', secret: true, on: 'finish', test: ({ g }) => !g.won && g.rules.endsOnTopOut && g.time < 20 },
  { id: 'i-hold', name: 'Guardián de la I', desc: 'Guarda una pieza I 10 veces en una partida', tier: 'silver', icon: 'I', secret: true, on: 'hold', test: ({ g, data }) => data.type === 'I' && (g.custom.iHolds = (g.custom.iHolds || 0) + 1) >= 10 },
];
