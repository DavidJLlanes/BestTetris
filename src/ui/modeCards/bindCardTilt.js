/**
 * Inclinación 3D de las tarjetas hacia el dedo o el ratón, con un brillo que sigue al puntero.
 * Solo escribe variables CSS (una vez por fotograma) y la tarjeta se mueve en la GPU.
 */
const MAX = 7; // grados

export function bindCardTilt(list) {
  let card = null, x = 0, y = 0, raf = 0;
  const paint = () => {
    raf = 0;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (x - r.left) / r.width)), py = Math.min(1, Math.max(0, (y - r.top) / r.height));
    card.style.setProperty('--rx', `${((0.5 - py) * MAX).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${((px - 0.5) * MAX * 1.2).toFixed(2)}deg`);
    card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
  };
  const release = (c) => { if (!c) return; c.classList.remove('tilt', 'down'); c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); };
  const track = (e) => {
    const c = e.target.closest && e.target.closest('.mode');
    if (c !== card) { release(card); card = c; if (card) card.classList.add('tilt'); }
    x = e.clientX; y = e.clientY;
    if (card && !raf) raf = requestAnimationFrame(paint);
  };
  list.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' || card) track(e); });
  list.addEventListener('pointerdown', (e) => { track(e); if (card) card.classList.add('down'); });
  const end = () => { release(card); card = null; };
  list.addEventListener('pointerup', end);
  list.addEventListener('pointercancel', end);
  list.addEventListener('pointerleave', end);
}
