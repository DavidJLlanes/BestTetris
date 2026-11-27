/** Estado de la decoración: calidad en uso, latido, parallax y temporizadores. */
export const decor = {
  quality: 'high',   // la que se usa de verdad (con 'auto' puede bajar sola)
  flash: 0,          // destello por líneas, 0..1, se apaga solo
  live: -1, tension: -1,
  px: 0, py: 0, tx: 0, ty: 0, // parallax actual y objetivo (-1..1)
  dustAcc: 0,
};
