/**
 * Safari de iPhone no tiene navigator.vibrate, pero desde iOS 18 un interruptor
 * (<input type="checkbox" switch>) da un toque háptico al cambiar con el dedo.
 * Se usa uno invisible y se pulsa su etiqueta dentro del mismo gesto.
 */
let label = null;

export function iosHaptic() {
  if (!label) {
    label = document.createElement('label');
    label.setAttribute('aria-hidden', 'true');
    label.style.cssText = 'position:fixed;left:-99px;top:0;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden';
    const input = document.createElement('input');
    input.type = 'checkbox'; input.setAttribute('switch', ''); input.tabIndex = -1;
    label.append(input);
    document.body.append(label);
  }
  try { label.click(); } catch { /* sin háptica */ }
}
