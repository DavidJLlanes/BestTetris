import { $ } from '../util/dom.js';
import { formatTime } from '../util/formatTime.js';
import { formatNumber } from '../util/formatNumber.js';
import { renderXpGain } from './xpGain.js';

/** Rellena la pantalla de fin de partida. */
export function renderGameOver(g, isBest) {
  const mode = g.hooks;
  const goal = g.rules.goalLines || g.rules.timeLimit || mode.isComplete;
  $('over-title').textContent = goal ? (g.won ? `¡${mode.name} completado!` : `${mode.name}: inténtalo otra vez`) : 'Fin de la partida';
  const rows = [
    ['Puntos', formatNumber(g.score)],
    ['Tiempo', formatTime(g.time, mode.record === 'time')],
    ['Líneas', g.lines],
  ];
  if (g.rules.levelUp) rows.push(['Nivel', g.level]);
  rows.push(['Piezas', g.stats.pieces], ['Prismas (4 líneas)', g.stats.quads], ['Giros-T', g.stats.tspins], ['Mejor combo', Math.max(0, g.stats.maxCombo)]);
  $('over-result').innerHTML = rows.map(([k, v]) => `<span>${k}</span><b>${v}</b>`).join('');
  $('over-best').hidden = !isBest;
  renderXpGain(g);
  const note = $('over-note');
  note.hidden = !g.stats.undos || mode.noRecord;
  note.textContent = `Deshiciste ${g.stats.undos} ${g.stats.undos === 1 ? 'vez' : 'veces'} (−${formatNumber(g.stats.undoPoints)} puntos): esta partida no cuenta para récords.`;
}
