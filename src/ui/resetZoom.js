/**
 * Devuelve la página a escala 1 si el navegador la ha ampliado. Safari no deja fijar la escala
 * desde JavaScript, pero vuelve a aplicar el meta viewport cuando cambia: se cambia un instante
 * y se restaura, y después se recoloca el desplazamiento en 0,0.
 */
let busy = false;

export function resetZoom() {
  const meta = document.querySelector('meta[name=viewport]');
  if (!meta || busy) return;
  busy = true;
  const content = meta.getAttribute('content');
  meta.setAttribute('content', content.replace('initial-scale=1', 'initial-scale=1.0001'));
  requestAnimationFrame(() => {
    meta.setAttribute('content', content);
    scrollTo(0, 0);
    busy = false;
  });
}
