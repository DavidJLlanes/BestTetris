/** Logros de técnica: giros-T, combos, back-to-back y limpiezas totales. */
export default [
  { id: 'tspin', name: 'Giro maestro', desc: 'Haz un giro-T que limpie una línea', tier: 'bronze', icon: 'T', on: 'score', test: ({ data }) => data.tspin === 'full' && data.lines >= 1 },
  { id: 'tspin-double', name: 'Doble giro', desc: 'Giro-T doble', tier: 'silver', icon: 'T', on: 'score', test: ({ data }) => data.tspin === 'full' && data.lines === 2 },
  { id: 'tspin-triple', name: 'Triple giro', desc: 'Giro-T triple', tier: 'gold', icon: 'T', on: 'score', test: ({ data }) => data.tspin === 'full' && data.lines === 3 },
  { id: 'mini', name: 'Pequeño pero matón', desc: 'Haz un mini giro-T', tier: 'bronze', icon: 't', on: 'score', test: ({ data }) => data.tspin === 'mini' },
  { id: 'tspin-10', name: 'Trompo', desc: '10 giros-T en una partida', tier: 'gold', icon: '↻', on: 'score', test: ({ g }) => g.stats.tspins >= 10 },
  { id: 'b2b', name: 'Doble filo', desc: 'Consigue un back-to-back', tier: 'bronze', icon: '⇉', on: 'score', test: ({ data }) => data.backToBack },
  { id: 'b2b-5', name: 'Cadena de cristal', desc: '5 back-to-back seguidos', tier: 'gold', icon: '⇉', on: 'score', test: ({ g }) => g.stats.b2bMax >= 5 },
  { id: 'combo-4', name: 'Racha', desc: 'Combo de 4', tier: 'bronze', icon: '×', on: 'score', test: ({ data }) => data.combo >= 4 },
  { id: 'combo-8', name: 'Cascada', desc: 'Combo de 8', tier: 'silver', icon: '×', on: 'score', test: ({ data }) => data.combo >= 8 },
  { id: 'combo-12', name: 'Diluvio', desc: 'Combo de 12', tier: 'gold', icon: '×', on: 'score', test: ({ data }) => data.combo >= 12 },
  { id: 'pc', name: 'Tabla rasa', desc: 'Deja el tablero vacío', tier: 'silver', icon: '□', on: 'perfectClear', test: () => true },
  { id: 'pc-3', name: 'Limpieza impecable', desc: '3 limpiezas totales en una partida', tier: 'prism', icon: '□', on: 'perfectClear', test: ({ g }) => g.stats.perfectClears >= 3 },
];
