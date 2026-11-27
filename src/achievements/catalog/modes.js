/** Logros de los distintos modos de juego. Se comprueban al terminar la partida. */
const won = (mode) => ({ g }) => g.mode === mode && g.won;
const timeUnder = (mode, s) => ({ g }) => g.mode === mode && g.won && g.time < s;

export default [
  { id: 'tutorial', name: 'Aprendiz de luz', desc: 'Completa el tutorial', tier: 'bronze', icon: '✋', on: 'finish', test: won('tutorial') },
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
  { id: 'seasons-year', name: 'Un año entero', desc: 'Vive las cuatro estaciones (40 líneas en Estaciones)', tier: 'silver', icon: '🍂', on: 'score', test: ({ g }) => g.mode === 'seasons' && g.lines >= 40 },
  { id: 'seasons-2', name: 'Veterano del tiempo', desc: '80 líneas en Estaciones', tier: 'gold', icon: '❄', on: 'score', test: ({ g }) => g.mode === 'seasons' && g.lines >= 80 },
  { id: 'sway-30', name: 'Marinero', desc: '30 líneas en Vaivén', tier: 'silver', icon: '〰', on: 'score', test: ({ g }) => g.mode === 'sway' && g.lines >= 30 },
  { id: 'sway-storm', name: 'Ojo de la tormenta', desc: 'Aguanta 3 ciclos completos en Vaivén', tier: 'gold', icon: '🌪', on: 'finish', test: ({ g }) => g.mode === 'sway' && g.custom.cycle >= 3 },
  { id: 'chaos-bombs', name: 'Artificiero', desc: '10 bombas en una partida de Caos', tier: 'silver', icon: '✸', on: 'score', test: ({ g }) => g.mode === 'chaos' && (g.stats.bombs || 0) >= 10 },
  { id: 'chaos-50', name: 'Domador del caos', desc: '50 líneas en Caos', tier: 'gold', icon: '✸', on: 'score', test: ({ g }) => g.mode === 'chaos' && g.lines >= 50 },
  { id: 'powers-3', name: 'Superpoderes', desc: 'Usa 3 poderes en una partida', tier: 'bronze', icon: '✦', on: 'score', test: ({ g }) => g.mode === 'powers' && (g.stats.powers || 0) >= 3 },
  { id: 'powers-60', name: 'Poder absoluto', desc: '60 líneas en Poderes', tier: 'gold', icon: '✦', on: 'score', test: ({ g }) => g.mode === 'powers' && g.lines >= 60 },
  { id: 'journey', name: 'Trotamundos', desc: 'Completa un Viaje por las cinco escenas', tier: 'silver', icon: '✧', on: 'finish', test: won('journey') },
  { id: 'journey-600', name: 'Viaje relámpago', desc: 'Completa un Viaje en menos de 10:00', tier: 'gold', icon: '✧', on: 'finish', test: timeUnder('journey', 600) },
  { id: 'drift-five', name: 'A la deriva', desc: 'Pasa por las cinco escenas en Deriva', tier: 'silver', icon: '☾', on: 'score', test: ({ g }) => g.mode === 'drift' && g.time >= 360 },
];
