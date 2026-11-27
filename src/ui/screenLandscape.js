/**
 * Orientación de la pantalla física, no del área visible: el teclado encoge lo visible
 * y no debe parecer que el móvil está en horizontal.
 */
export function screenLandscape() {
  const t = screen.orientation && screen.orientation.type;
  if (t) return t.startsWith('landscape');
  if (typeof window.orientation === 'number') return Math.abs(window.orientation) === 90;
  return innerWidth > innerHeight;
}
