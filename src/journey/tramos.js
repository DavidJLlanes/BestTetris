/**
 * Los 8 tramos del Viaje, de abajo arriba. Cada uno con su luz (escena de la partida), su
 * nebulosa en el mapa, su música, el elemento nuevo que presenta, las estrellas que pide para
 * entrar y el planeta tienda que espera al final (tras vencer a su jefe).
 */
export const TRAMOS = [
  { id: 'boreal', name: 'Cielo boreal', colors: ['#1fd1a0', '#2a6bff', '#7a4dff'], tint: '#bfffe9', particle: 'snow', style: 'cristal', transpose: 0,
    nebula: ['#1fd1a0', '#2a6bff'], gate: 0, element: null, intro: 'Tus primeras luces: líneas, puntos y aguante.', planet: { name: 'Planeta Aurora', color: '#3fe0b0' } },
  { id: 'primavera', name: 'Cielo de primavera', colors: ['#ffc53d', '#ff6aa8', '#7a4dff'], tint: '#fff0b8', particle: 'firefly', style: 'nocturno', transpose: 2,
    nebula: ['#ffc53d', '#ff6aa8'], gate: 10, element: 'astros', intro: 'Aparecen los astros: completa su fila para recogerlos.', planet: { name: 'Planeta Miel', color: '#ffc53d' } },
  { id: 'verano', name: 'Noches de verano', colors: ['#2fa8ff', '#00e0c6', '#6b5cff'], tint: '#bfe9ff', particle: 'firefly', style: 'cascada', transpose: 0,
    nebula: ['#2fa8ff', '#00e0c6'], gate: 22, element: 'dust', intro: 'Polvo cósmico: bloques que necesitan dos líneas.', planet: { name: 'Planeta Coral', color: '#ff8a6b' } },
  { id: 'otono', name: 'Mares de otoño', colors: ['#b04dff', '#ff4fd8', '#2a3bff'], tint: '#efc8ff', particle: 'bubble', style: 'cristal', transpose: -2,
    nebula: ['#b04dff', '#ff4fd8'], gate: 36, element: 'shooting', intro: 'Estrellas fugaces: completa su fila antes de que se apaguen.', planet: { name: 'Planeta Lila', color: '#c07bff' } },
  { id: 'invierno', name: 'Cielo de invierno', colors: ['#9fe8ff', '#4a7dff', '#c8d6ff'], tint: '#e8f7ff', particle: 'snow', style: 'nocturno', transpose: 0,
    nebula: ['#9fe8ff', '#4a7dff'], gate: 50, element: 'ice', intro: 'Hielo: su fila no se limpia hasta que una línea vecina lo funde.', planet: { name: 'Planeta Escarcha', color: '#bfefff' } },
  { id: 'sur', name: 'Cruz del Sur', colors: ['#ff5c7a', '#ff9d4f', '#7a2bff'], tint: '#ffd0c0', particle: 'ember', style: 'cascada', transpose: 3,
    nebula: ['#ff5c7a', '#ff9d4f'], gate: 64, element: 'comets', intro: 'Cometas: piezas que rompen toda su columna al caer.', planet: { name: 'Planeta Brasa', color: '#ff7a5c' } },
  { id: 'abismo', name: 'El abismo', colors: ['#6a1bff', '#12052a', '#ff2fb4'], tint: '#e0b8ff', particle: 'rain', style: 'arcade', transpose: -3,
    nebula: ['#6a1bff', '#ff2fb4'], gate: 80, element: 'holes', intro: 'Agujeros negros: atraen la pieza y se tragan una fila más.', planet: { name: 'Planeta Umbra', color: '#9a5cff' } },
  { id: 'corazon', name: 'Corazón de la galaxia', colors: ['#ffd34f', '#ff4fd8', '#46e6ff'], tint: '#fff3c4', particle: 'ember', style: 'arcade', transpose: 5,
    nebula: ['#ffd34f', '#46e6ff'], gate: 96, element: 'all', intro: 'Todo a la vez, y los jefes más duros.', planet: null },
];
