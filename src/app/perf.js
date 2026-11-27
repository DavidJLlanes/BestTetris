/**
 * Medidor de rendimiento: duración de los fotogramas y coste de cada uno.
 * Se ve en pantalla añadiendo ?fps a la dirección.
 */
const SIZE = 240;
const frames = new Float32Array(SIZE), costs = new Float32Array(SIZE);
let i = 0, n = 0, el = null;

export const perf = {
  record(dt, cost) {
    frames[i] = dt * 1000; costs[i] = cost;
    i = (i + 1) % SIZE; n = Math.min(n + 1, SIZE);
    if (el && i % 15 === 0) el.textContent = this.summary();
  },
  stats() {
    const f = Array.from(frames.slice(0, n)), c = Array.from(costs.slice(0, n));
    const avg = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
    const sorted = c.slice().sort((a, b) => a - b);
    return { fps: 1000 / avg(f), avgCostMs: avg(c), p95CostMs: sorted[Math.floor(sorted.length * 0.95)] || 0, maxCostMs: sorted.at(-1) || 0 };
  },
  summary() {
    const s = this.stats();
    return `${s.fps.toFixed(0)} fps · ${s.avgCostMs.toFixed(2)} ms/fotograma (p95 ${s.p95CostMs.toFixed(2)})`;
  },
  show() {
    el = document.createElement('div');
    el.className = 'perf';
    document.body.appendChild(el);
  },
};
