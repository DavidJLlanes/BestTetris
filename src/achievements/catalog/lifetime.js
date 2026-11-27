import { MODES } from '../../modes/registry.js';

/** Logros de constancia: partidas, piezas y tiempo jugado. */
export default [
  { id: 'games-1', name: 'Bienvenida', desc: 'Termina tu primera partida', tier: 'bronze', icon: '▶', on: 'finish', test: ({ profile }) => profile.games >= 1 },
  { id: 'games-10', name: 'Habitual', desc: 'Juega 10 partidas', tier: 'bronze', icon: '▶', on: 'finish', test: ({ profile }) => profile.games >= 10 },
  { id: 'games-100', name: 'Incondicional', desc: 'Juega 100 partidas', tier: 'gold', icon: '▶', on: 'finish', test: ({ profile }) => profile.games >= 100 },
  { id: 'pieces-1000', name: 'Constructor', desc: 'Coloca 1.000 piezas', tier: 'bronze', icon: '▦', on: 'finish', test: ({ profile }) => profile.pieces >= 1000 },
  { id: 'pieces-10000', name: 'Arquitecto', desc: 'Coloca 10.000 piezas', tier: 'gold', icon: '▦', on: 'finish', test: ({ profile }) => profile.pieces >= 10000 },
  { id: 'time-1h', name: 'Una hora de luz', desc: 'Juega 1 hora en total', tier: 'silver', icon: '◷', on: 'finish', test: ({ profile }) => profile.playTime >= 3600 },
  { id: 'time-10h', name: 'Devoto', desc: 'Juega 10 horas en total', tier: 'prism', icon: '◷', on: 'finish', test: ({ profile }) => profile.playTime >= 36000 },
  { id: 'all-modes', name: 'Explorador', desc: 'Juega a todos los modos', tier: 'silver', icon: '✧', on: 'finish', test: ({ profile }) => MODES.filter((m) => !m.noRecord).every((m) => profile.modesPlayed[m.id]) },
];
