/**
 * Prueba de navegador (no entra en `npm test`): app instalada en iPhone, donde iOS deja el área de
 * diseño más corta que la pantalla (893 de 956) aunque pinta desde arriba. La app, el fondo y la
 * decoración deben llegar hasta abajo del todo y los botones quedar enteros sobre la barra de inicio.
 * Uso: servir el juego en :8123 y `node tests/e2e/installed-fullheight.e2e.cjs`. Necesita Playwright.
 */
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 440, height: 893 }, screen: { width: 440, height: 956 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, userAgent: devices['iPhone 13'].userAgent });
  const p = await ctx.newPage();
  await p.addInitScript(() => Object.defineProperty(navigator, 'standalone', { get: () => true }));
  await p.route('**/src/util/safeArea.js', (r) => r.fulfill({ contentType: 'text/javascript', body: 'export function safeArea(){return {top:62,bottom:34,left:0,right:0};}' }));
  await p.goto('http://localhost:8123/'); await p.waitForTimeout(800);
  await p.click('button[data-mode=marathon]'); await p.waitForTimeout(2600);
  const r = await p.evaluate(() => { const q = (s) => { const r = document.querySelector(s).getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; }; return { app: q('#app'), decor: q('#decor'), aurora: q('.aurora'), top: q('.topbar'), touch: q('#touch') }; });
  const bad = [];
  for (const k of ['app', 'decor', 'aurora']) if (r[k][1] < 955) bad.push(`${k} acaba en ${r[k][1]}`);
  if (r.top[0] < 62) bad.push('barra bajo la isla');
  if (r.touch[1] > 956 - 34 + 1) bad.push(`botones bajo la barra de inicio: ${r.touch[1]}`);
  await b.close();
  console.log(bad.length ? 'FALLO ' + bad.join('; ') : 'App instalada: ocupa la pantalla entera, sin franja, botones enteros');
  process.exit(bad.length ? 1 : 0);
})();
