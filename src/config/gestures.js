/**
 * Tolerancias de los gestos táctiles. Están pensadas para dedos reales:
 * temblor, trazos torcidos y toques que se mueven un poco.
 */
export const GESTURE = {
  deadZone: 0.5,      // celdas: por debajo, el dedo "no se ha movido" (sigue siendo un toque)
  deadZoneMin: 10,    // px mínimos de esa zona muerta
  deadZoneMax: 20,    // px máximos
  lockCells: 0.8,     // recorrido para decidir el eje: lo bastante largo para que un temblor no engañe
  axisBias: 1.0,      // > 1 favorece el eje vertical al decidir; 1 = 45°
  hysteresis: 0.6,    // columnas de margen antes de cambiar de columna (evita el baile en el borde)
  stepX: 0.9,         // celdas de dedo por columna movida
  stepY: 0.9,         // celdas de dedo por fila al bajar arrastrando
  tapMaxMs: 320,      // un toque más largo no gira (el jugador dudó)
  flickSpeed: 0.55,   // px/ms en los últimos instantes para soltar de golpe
  flickMinCells: 1.2, // recorrido vertical mínimo para soltar de golpe
  velocityWindow: 90, // ms usados para medir la velocidad final
};
