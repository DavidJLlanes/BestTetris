import { modeIcon } from './modeIcons.js';
import { modeStyle } from './modeStyle.js';

/** Una tarjeta de modo: cristal con el color del modo, icono propio, textos e insignia de récord. */
export function modeCardHtml({ id, name, description, attrs = `data-mode="${id}"`, best = `data-best="${id}"`, featured = false, ribbon = '' }, i) {
  const [c1, c2, anim] = modeStyle(id);
  return `
    <button class="mode${featured ? ' featured' : ''}" ${attrs} data-anim="${anim}" style="--c1:${c1};--c2:${c2};--i:${i}">
      <span class="mode-glow" aria-hidden="true"></span>
      <span class="mode-icon">${modeIcon(id)}</span>
      <span class="mode-name">${name}${ribbon ? `<em class="mode-ribbon">${ribbon}</em>` : ''}</span>
      <small class="mode-desc">${description}</small>
      <small class="mode-best" ${best}></small>
      <span class="mode-sheen" aria-hidden="true"></span>
    </button>`;
}
