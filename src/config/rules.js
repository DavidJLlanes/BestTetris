/** Reglas por defecto de una partida. Cada modo solo declara lo que cambia. */
export const DEFAULT_RULES = {
  startLevel: 1,
  levelUp: true,        // sube de nivel con las líneas
  linesPerLevel: 10,
  fixedInterval: null,  // segundos por fila fijos (ignora el nivel)
  goalLines: null,      // termina con victoria al llegar a estas líneas
  timeLimit: null,      // termina con victoria al agotar el tiempo (segundos)
  endsOnTopOut: true,   // false = el tablero se vacía y se sigue (zen)
  hold: true,           // se permite reservar
  ghost: true,          // se permite la pieza fantasma
  garbageRows: 0,       // filas de basura al empezar
  previews: 5,          // piezas siguientes visibles
  undo: 0, // jugadas que se pueden deshacer por partida (0 = no, Infinity = sin límite)
  undoCost: 0, // puntos del primer deshacer; el segundo cuesta el doble, etc.
  stackAlpha: 1,        // opacidad de los bloques fijos (modo sombra)
  star: false,          // momento estelar: medidor que se llena con líneas y congela el tiempo
};
