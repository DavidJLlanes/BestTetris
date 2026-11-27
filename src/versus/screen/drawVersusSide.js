import { drawPreview } from '../../render/drawPreview.js';

/** Reserva, siguientes y cifras de un jugador; solo se tocan si cambian. */
export function drawVersusSide(u, p, wins) {
  const g = p.game;
  const key = `${g.hold}|${g.holdUsed}|${g.queue.slice(0, 4).join('')}`;
  if (u.last.key !== key) {
    u.last.key = key;
    drawPreview(u.hold, [g.hold], 1, g.holdUsed, false);
    drawPreview(u.next, g.queue.slice(0, 4), 4, false, false);
  }
  const set = (el, k, v) => { if (u.last[k] !== v) { u.last[k] = v; el.textContent = v; } };
  set(u.lines, 'lines', g.lines);
  set(u.sent, 'sent', p.sent);
  set(u.wins, 'wins', '★'.repeat(wins) || ' ');
}
