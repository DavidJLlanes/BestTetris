/** Dos jugadores en un mismo teclado: cada uno en su mitad. Los mandos van por orden de conexión. */
export const VS_KEYS = [
  { KeyA: 'left', KeyD: 'right', KeyS: 'soft', KeyW: 'cw', KeyQ: 'ccw', KeyE: 'hold', Space: 'hard' },
  {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'soft', ArrowUp: 'cw',
    ControlRight: 'ccw', ShiftRight: 'hold', Enter: 'hard', NumpadEnter: 'hard', Numpad0: 'hard',
  },
];

/** Líneas de basura que se envían según la jugada. */
export const ATTACK = {
  lines: [0, 0, 1, 2, 4],          // 1, 2, 3 o 4 líneas
  tspin: [0, 2, 4, 6],             // giro-T con 0..3 líneas (un giro-T sin líneas no envía)
  backToBack: 1,                   // extra por encadenar jugadas difíciles
  combo: [0, 0, 1, 1, 2, 2, 3, 3, 4], // extra según el combo (luego se queda en 4)
  perfectClear: 10,
};

/** La partida se acelera cada tantos segundos, para que no se alargue sin fin. */
export const VS_SPEEDUP_S = 30;
export const VS_NAMES = ['Jugador 1', 'Jugador 2'];
export const VS_COLORS = ['#46e6ff', '#ff4fd8'];
