/** ¿Hay un campo de texto con el foco? (en móvil, el teclado está abierto y encoge lo visible) */
export function isTyping() {
  const el = document.activeElement;
  if (!el) return false;
  if (el.isContentEditable || el.tagName === 'TEXTAREA') return true;
  return el.tagName === 'INPUT' && !/^(button|checkbox|radio|range|color|file|submit|reset|image)$/i.test(el.type);
}
