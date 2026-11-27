import { $ } from '../../util/dom.js';
import { onOpen } from '../overlays.js';
import { loadHistory } from '../../storage/history.js';
import { getMode } from '../../modes/registry.js';
import { RECORD_KINDS } from '../../modes/recordKinds.js';
import { formatNumber } from '../../util/formatNumber.js';
import { formatTime } from '../../util/formatTime.js';
import { lineChartSvg } from './lineChartSvg.js';

const LAST = 40;

/** Valor que cuenta en un modo: puntos, líneas o tiempo (solo partidas completadas). */
function series(history, mode) {
  const rows = history.filter((r) => r[1] === mode.id);
  if (mode.record === 'time') return rows.filter((r) => r[5]).map((r) => r[4]);
  return rows.map((r) => (mode.record === 'lines' ? r[3] : r[2]));
}

function render(modeId) {
  const mode = getMode(modeId), hist = loadHistory();
  const values = series(hist, mode).slice(-LAST);
  const time = mode.record === 'time';
  $('stats-chart').innerHTML = lineChartSvg(values, { lowerIsBetter: time });
  const fmt = (v) => (time ? formatTime(v, true) : formatNumber(Math.round(v)));
  const played = hist.filter((r) => r[1] === modeId).length;
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const best = values.length ? (time ? Math.min(...values) : Math.max(...values)) : 0;
  $('stats-summary').innerHTML = [
    ['Partidas', played], ['Mejor (últimas)', values.length ? fmt(best) : '—'],
    ['Media', values.length ? fmt(avg) : '—'], ['Última', values.length ? fmt(values[values.length - 1]) : '—'],
  ].map(([k, v]) => `<span>${k}</span><b>${v}</b>`).join('');
}

/** Estadísticas por modo con la evolución de las últimas partidas. */
export function bindStatsPanel() {
  const select = $('stats-mode');
  onOpen('ov-stats', () => {
    const hist = loadHistory();
    const ids = [...new Set(hist.map((r) => r[1]))].filter((id) => getMode(id) && RECORD_KINDS[getMode(id).record]);
    const last = hist.length ? hist[hist.length - 1][1] : 'marathon';
    select.innerHTML = (ids.length ? ids : ['marathon']).map((id) => `<option value="${id}">${getMode(id).icon} ${getMode(id).name}</option>`).join('');
    select.value = ids.includes(last) ? last : select.options[0].value;
    render(select.value);
  });
  select.addEventListener('change', () => render(select.value));
}
