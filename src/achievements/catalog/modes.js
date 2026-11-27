/** Logros de los distintos modos de juego. Se comprueban al terminar la partida. */
const won = (mode) => ({ g }) => g.mode === mode && g.won;
const timeUnder = (mode, s) => ({ g }) => g.mode === mode && g.won && g.time < s;

export default [
  { id: 'sprint', name: 'Esprínter', desc: 'Completa un Sprint 40', tier: 'bronze', icon: '⏱', on: 'finish', test: won('sprint') },
  { id: 'sprint-120', name: 'Ráfaga', desc: 'Sprint 40 en menos de 2:00', tier: 'silver', icon: '⏱', on: 'finish', test: timeUnder('sprint', 120) },
  { id: 'sprint-60', name: 'Relámpago', desc: 'Sprint 40 en menos de 1:00', tier: 'prism', icon: '⏱', on: 'finish', test: timeUnder('sprint', 60) },
  { id: 'ultra-20k', name: 'Dos minutos de gloria', desc: '20.000 puntos en Ultra', tier: 'silver', icon: '⚡', on: 'finish', test: ({ g }) => g.mode === 'ultra' && g.score >= 20000 },
  { id: 'ultra-50k', name: 'Tormenta', desc: '50.000 puntos en Ultra', tier: 'gold', icon: '⚡', on: 'finish', test: ({ g }) => g.mode === 'ultra' && g.score >= 50000 },
  { id: 'dig', name: 'Minero', desc: 'Completa Excavación', tier: 'bronze', icon: '⛏', on: 'finish', test: won('dig') },
  { id: 'dig-60', name: 'Taladro', desc: 'Excavación en menos de 1:00', tier: 'gold', icon: '⛏', on: 'finish', test: timeUnder('dig', 60) },
  { id: 'tide-50', name: 'Rompeolas', desc: '50 líneas en Marea', tier: 'silver', icon: '🌊', on: 'score', test: ({ g }) => g.mode === 'tide' && g.lines >= 50 },
  { id: 'tide-180', name: 'Faro', desc: 'Aguanta 3 minutos en Marea', tier: 'gold', icon: '🌊', on: 'finish', test: ({ g }) => g.mode === 'tide' && g.time >= 180 },
  { id: 'master-50', name: 'Aprendiz', desc: '50 líneas en Maestro', tier: 'silver', icon: '♛', on: 'score', test: ({ g }) => g.mode === 'master' && g.lines >= 50 },
  { id: 'master', name: 'Gran maestro', desc: 'Completa Maestro', tier: 'prism', icon: '♛', on: 'finish', test: won('master') },
  { id: 'shadow-40', name: 'Memoria fotográfica', desc: '40 líneas en Sombra', tier: 'gold', icon: '◐', on: 'score', test: ({ g }) => g.mode === 'shadow' && g.lines >= 40 },
  { id: 'purist', name: 'Sin red', desc: 'Completa Purista', tier: 'gold', icon: '◇', on: 'finish', test: won('purist') },
  { id: 'daily', name: 'Cita diaria', desc: 'Completa un desafío diario', tier: 'bronze', icon: '☀', on: 'finish', test: won('daily') },
  { id: 'zen-200', name: 'Nirvana', desc: '200 líneas en una partida Zen', tier: 'silver', icon: '☯', on: 'score', test: ({ g }) => g.mode === 'zen' && g.lines >= 200 },
];
