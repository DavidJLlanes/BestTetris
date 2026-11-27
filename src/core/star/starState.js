/** Estado del momento estelar dentro de g.custom (así deshacer lo guarda y lo restaura). */
export function starState(g) {
  if (!g.custom.star) g.custom.star = { charge: 0, active: false, time: 0, total: 0, stacked: 0, ending: false };
  return g.custom.star;
}
export const starEnabled = (g) => !!g.rules.star;
