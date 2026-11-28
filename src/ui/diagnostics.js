import { safeArea } from '../util/safeArea.js';
import { audio } from '../audio/context.js';
import { padLine } from '../input/gamepad/padStatus.js';
import { app } from '../app/state.js';

/**
 * Diagnóstico de pantalla (añade ?diag a la dirección): medidas reales que da el navegador
 * para encontrar fallos de diseño en un dispositivo concreto. No envía nada a ningún sitio.
 */
function unitHeight(unit) {
  const d = document.createElement('div');
  d.style.cssText = `position:fixed;top:0;left:0;width:1px;height:100${unit};visibility:hidden;pointer-events:none`;
  document.body.appendChild(d);
  const h = Math.round(d.getBoundingClientRect().height);
  d.remove();
  return h;
}
const rect = (sel) => { const e = document.querySelector(sel); if (!e) return '—'; const r = e.getBoundingClientRect(); return `${Math.round(r.top)}…${Math.round(r.bottom)}`; };

export function showDiagnostics() {
  if (!new URLSearchParams(location.search).has('diag')) return;
  const el = document.createElement('pre');
  el.style.cssText = 'position:fixed;left:4px;top:50%;z-index:999;margin:0;padding:6px 8px;font:11px/1.35 ui-monospace,monospace;color:#fff;background:rgba(0,0,0,.78);border-radius:8px;pointer-events:none;white-space:pre';
  document.body.appendChild(el);
  const tick = () => {
    const vv = window.visualViewport, sa = safeArea();
    el.textContent = [
      `inner ${innerWidth}x${innerHeight}  screen ${screen.width}x${screen.height}`,
      vv ? `vv ${Math.round(vv.width)}x${Math.round(vv.height)} top ${Math.round(vv.offsetTop)} esc ${vv.scale.toFixed(2)}` : 'vv —',
      `svh ${unitHeight('svh')} dvh ${unitHeight('dvh')} lvh ${unitHeight('lvh')} vh ${unitHeight('vh')}`,
      `seguro ↑${sa.top} ↓${sa.bottom} ←${sa.left} →${sa.right}`,
      `scroll ${scrollY}  app ${rect('#app')}  standalone ${navigator.standalone ? 'sí' : 'no'}`,
      `vars h ${getComputedStyle(document.documentElement).getPropertyValue('--app-h')} t ${getComputedStyle(document.documentElement).getPropertyValue('--pad-t')} b ${getComputedStyle(document.documentElement).getPropertyValue('--pad-b')}`,
      `barra ${rect('.topbar')}  tablero ${rect('#board')}`,
      `botones ${rect('#touch')}`,
      `audio ${audio.ctx ? `${audio.ctx.state} ${audio.ctx.sampleRate}Hz` : 'sin crear'}  sesión ${navigator.audioSession ? navigator.audioSession.type : '—'}  silenciado ${audio.muted ? 'sí' : 'no'}  abierto ${audio.unlocked ? 'sí' : 'no'}  vol ${audio.musicVol}/${audio.sfxVol}`,
      padLine(),
      `pantalla ${app.screen}  foco ${document.activeElement ? document.activeElement.tagName + ' ' + (document.activeElement.id || document.activeElement.dataset.mode || '') : '—'}`,
      document.body.className,
    ].join('\n');
  };
  tick();
  setInterval(tick, 500);
}
