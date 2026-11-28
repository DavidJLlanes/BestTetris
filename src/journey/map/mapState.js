/** Estado del mapa del Viaje (uno solo, vive mientras la página). */
export const map = {
  canvas: null, ctx: null, w: 0, h: 0, dpr: 1, k: 1, anchorY: 0,
  running: false, last: 0, time: 0, slowFrames: 0,
  nodes: [], byId: {}, path: [], top: 0,
  cam: { y: 0, v: 0, target: null, drag: false },
  focusX: 0, // la cámara se acerca de lado a una parada al hacer zoom
  zoom: 0, zoomTo: 0, zoomDone: null,
  sel: null, // id de la parada elegida
  ship: { id: null, from: null, t: 1 }, // la nave: dónde está y su viaje en curso
  lit: 0, // hasta qué punto del camino llega la luz (índice de parada, con decimales)
  parts: [], // chispas en pantalla
  streaks: [], // estrellas fugaces del fondo
  celebrate: null,
  hit: [], // paradas visibles este fotograma, para tocar
  pops: {}, // paradas que se acaban de abrir (rebotan)
  drawOrder: [], // paradas de la más lejana a la más cercana
  spriteRes: 1, tileDpr: 1,
};
