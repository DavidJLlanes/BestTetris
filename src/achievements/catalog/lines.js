/**
 * Logros de líneas. Cada logro: id, nombre, descripción, nivel (tier), icono,
 * on (eventos que lo comprueban) y test({ g, data, profile }) → true si se cumple.
 */
export default [
  { id: 'first-line', name: 'Primera luz', desc: 'Limpia tu primera línea', tier: 'bronze', icon: '✦', on: 'score', test: ({ data }) => data.lines >= 1 },
  { id: 'first-prism', name: '¡Prisma!', desc: 'Limpia 4 líneas de una vez', tier: 'bronze', icon: '◆', on: 'score', test: ({ data }) => data.lines >= 4 },
  { id: 'prism-x4', name: 'Cuarteto', desc: '4 Prismas en una partida', tier: 'silver', icon: '◆', on: 'score', test: ({ g }) => g.stats.quads >= 4 },
  { id: 'prism-x10', name: 'Joyero', desc: '10 Prismas en una partida', tier: 'gold', icon: '💎', on: 'score', test: ({ g }) => g.stats.quads >= 10 },
  { id: 'lines-100', name: 'Centenario', desc: '100 líneas en total', tier: 'bronze', icon: '≡', on: 'score', test: ({ profile }) => profile.lines >= 100 },
  { id: 'lines-1000', name: 'Mil destellos', desc: '1.000 líneas en total', tier: 'silver', icon: '≡', on: 'score', test: ({ profile }) => profile.lines >= 1000 },
  { id: 'lines-10000', name: 'Catedral de luz', desc: '10.000 líneas en total', tier: 'prism', icon: '≡', on: 'score', test: ({ profile }) => profile.lines >= 10000 },
  { id: 'game-150', name: 'Fondo', desc: '150 líneas en una partida', tier: 'gold', icon: '⇊', on: 'score', test: ({ g }) => g.lines >= 150 },
];
