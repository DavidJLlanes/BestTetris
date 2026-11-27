/**
 * Prueba de navegador (no entra en `npm test`): tablets Android e iPad, en vertical y horizontal,
 * en navegador y como app instalada. El menú cabe con todas las tarjetas enteras y opaco detrás, y
 * en partida la barra, el tablero y los botones quedan dentro de lo visible, sin marca de agua.
 * Uso: servir el juego en :8123 y `node tests/e2e/tablet-layout.e2e.cjs [carpeta-capturas]`.
 */
const { chromium, devices } = require('playwright');
const SHOTS = process.argv[2];
const CASES = [
  // nombre, ancho, alto visible, alto de pantalla, agente, instalada
  ['android-v-app', 800, 1238, 1280, devices['Galaxy Tab S4'].userAgent, true],
  ['android-v', 800, 1150, 1280, devices['Galaxy Tab S4'].userAgent, false],
  ['android-h-app', 1280, 758, 800, devices['Galaxy Tab S4'].userAgent, true],
  ['ipad-v', 820, 1106, 1180, devices['iPad Pro 11'].userAgent, false],
  ['ipad-h', 1180, 746, 820, devices['iPad Pro 11'].userAgent, false],
];
(async () => {
  const b = await chromium.launch();
  const bad = [];
  for (const [name, w, h, sh, ua, app] of CASES) {
    const portrait = h > w;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, screen: { width: w, height: portrait ? sh : sh }, hasTouch: true, userAgent: ua, deviceScaleFactor: name.startsWith('android') ? 2.25 : 1 });
    await ctx.addInitScript(([portrait, app]) => {
      Object.defineProperty(screen, 'orientation', { value: { type: portrait ? 'portrait-primary' : 'landscape-primary', angle: 0, addEventListener() {} } });
      if (app) { const mm = window.matchMedia.bind(window); window.matchMedia = (q) => (/display-mode: (standalone|fullscreen)/.test(q) ? { matches: true, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} } : mm(q)); }
    }, [portrait, app]);
    const p = await ctx.newPage();
    await p.goto('http://localhost:8123/'); await p.waitForTimeout(1500);
    const menu = await p.evaluate(() => {
      const ov = document.getElementById('ov-menu'); const bg = getComputedStyle(ov).backgroundImage + getComputedStyle(ov).backgroundColor;
      const card = ov.querySelector('.card').getBoundingClientRect();
      const broken = [...document.querySelectorAll('#mode-list .mode')].filter((m) => { const r = m.getBoundingClientRect(); const n = m.querySelector('.mode-name').getBoundingClientRect(); const i = m.querySelector('.mode-icon').getBoundingClientRect(); return !n.width || !i.width || n.right > r.right + 1 || r.right > card.right + 1; }).map((m) => m.dataset.mode || 'puzles');
      return { opaque: /gradient/.test(bg), broken };
    });
    if (!menu.opaque) bad.push(`${name}: menú transparente`);
    if (menu.broken.length) bad.push(`${name}: tarjetas rotas ${menu.broken}`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/tablet-${name}-menu.png` });
    await p.evaluate(() => document.querySelector('[data-mode=marathon]').click());
    await p.waitForTimeout(2800);
    const g = await p.evaluate(() => { const q = (s) => { const e = document.querySelector(s); if (!e || !e.offsetParent && getComputedStyle(e).position !== 'fixed') return null; const r = e.getBoundingClientRect(); return r.height ? [Math.round(r.top), Math.round(r.bottom)] : null; };
      return { h: innerHeight, app: q('#app'), top: q('.topbar'), board: q('#board'), touch: q('#touch'), mark: !!document.querySelector('.board-mark') }; });
    if (g.mark) bad.push(`${name}: marca de agua en el tablero`);
    if (g.app[1] > g.h + 1) bad.push(`${name}: la app pasa de lo visible (${g.app[1]} > ${g.h})`);
    if (g.touch && g.touch[1] > g.h + 1) bad.push(`${name}: botones cortados (${g.touch[1]} > ${g.h})`);
    if (g.touch && g.touch[0] - g.board[1] > 60) bad.push(`${name}: hueco de ${g.touch[0] - g.board[1]} px entre tablero y botones`);
    if (SHOTS) await p.screenshot({ path: `${SHOTS}/tablet-${name}-game.png` });
    console.log(name, JSON.stringify(menu), JSON.stringify(g));
    await ctx.close();
  }
  await b.close();
  console.log(bad.length ? 'FALLO ' + bad.join('; ') : 'Tablets: menú entero y opaco, partida dentro de la pantalla');
  process.exit(bad.length ? 1 : 0);
})();
