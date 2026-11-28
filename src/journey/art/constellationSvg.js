/**
 * La misma constelación en SVG (para el Atlas: muchas miniaturas ligeras, sin lienzos).
 * lit: encendida o solo su silueta · color: color del tramo.
 */
export function constellationSvg(sky, { lit = true, color = '#9fd8ff' } = {}) {
  const lines = sky.lines.map(([a, b]) => {
    const [x1, y1] = sky.stars[a], [x2, y2] = sky.stars[b];
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join('');
  const stars = sky.stars.map(([x, y, m]) => `<circle cx="${x}" cy="${y}" r="${(1.6 + m * 0.9).toFixed(1)}"/>`).join('');
  const glow = sky.stars.map(([x, y, m]) => `<circle cx="${x}" cy="${y}" r="${(5 + m * 2.5).toFixed(1)}"/>`).join('');
  return `<svg class="cst ${lit ? 'lit' : 'dim'}" viewBox="-8 -8 116 116" style="--cc:${color}" aria-hidden="true">
    <g class="cst-glow">${lit ? glow : ''}</g><g class="cst-lines">${lit ? lines : ''}</g><g class="cst-stars">${stars}</g></svg>`;
}
