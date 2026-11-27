/**
 * Gráfica de línea en SVG a partir de valores. lowerIsBetter da la vuelta al eje
 * (en los modos de tiempo, mejorar es bajar). Marca el mejor punto.
 */
export function lineChartSvg(values, { lowerIsBetter = false, w = 320, h = 140, pad = 12 } = {}) {
  if (values.length < 2) return '<p class="empty">Juega al menos dos partidas en este modo para ver tu evolución.</p>';
  const min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const x = (i) => pad + (i * (w - pad * 2)) / (values.length - 1);
  const y = (v) => { const k = (v - min) / span; return pad + (lowerIsBetter ? k : 1 - k) * (h - pad * 2); };
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const best = values.indexOf(lowerIsBetter ? min : max);
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Evolución de tus partidas">
    <defs><linearGradient id="lc" x1="0" x2="1"><stop offset="0" stop-color="#46e6ff"/><stop offset="1" stop-color="#ff4fd8"/></linearGradient>
    <linearGradient id="lf" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#46e6ff" stop-opacity=".25"/><stop offset="1" stop-color="#46e6ff" stop-opacity="0"/></linearGradient></defs>
    <polygon points="${x(0)},${h - pad} ${pts} ${x(values.length - 1)},${h - pad}" fill="url(#lf)"/>
    <polyline points="${pts}" fill="none" stroke="url(#lc)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${x(best)}" cy="${y(values[best])}" r="5" fill="#ffd34f" stroke="#0b0820" stroke-width="2"/>
  </svg>`;
}
