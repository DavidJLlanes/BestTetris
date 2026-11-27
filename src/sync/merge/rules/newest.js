/** Ajustes, nombre y foto: gana el que se cambió más tarde (en empate, el de b). */
export function newest(a, b, ctx) {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return (ctx.stampA || 0) > (ctx.stampB || 0) ? a : b;
}
