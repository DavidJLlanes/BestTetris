/** Direcciones pulsadas y temporizadores del desplazamiento automático. */
export const held = { left: false, right: false, dir: 0, dasT: 0, arrT: 0 };

export function releaseAll() {
  held.left = held.right = false;
  held.dir = 0;
}
