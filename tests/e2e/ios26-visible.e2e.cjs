/**
 * Prueba de navegador (no entra en `npm test`): simula Safari de iOS 26, donde la página mide
 * todo el alto de la pantalla pero solo se ve la franja entre la isla dinámica y la barra flotante
 * (visualViewport), y además hay márgenes seguros. Comprueba que barra superior, tablero, paneles
 * y todos los botones caen dentro de lo visible y que no hay desbordamiento horizontal.
 * Uso: servir el juego en :8123 y `node tests/e2e/ios26-visible.e2e.cjs`. Necesita Playwright.
 */
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch(); let fail = 0;
  const CASES = [[440, 956, 732, 62, 70], [393, 852, 659, 59, 34], [375, 667, 553, 20, 0], [430, 932, 740, 59, 60], [360, 800, 640, 24, 16]];
  // Además, sin barras: anchos 360 a 430 y altos 640 a 932
  for (const w of [360, 375, 390, 414, 430]) for (const h of [640, 740, 844, 932]) CASES.push([w, h, h, 0, 0]);
  for (const [w, full, vis, top, bot] of CASES) {
    const ctx = await b.newContext({ viewport: { width: w, height: full }, screen: { width: w, height: full }, isMobile: true, hasTouch: true, userAgent: devices['iPhone 13'].userAgent });
    const p = await ctx.newPage();
    if (vis < full) await p.addInitScript(([vis, top, bot]) => {
      Object.defineProperty(window, 'visualViewport', { value: Object.assign(new EventTarget(), { width: innerWidth, get height() { return vis; }, offsetTop: 0, offsetLeft: 0, scale: 1 }) });
    }, [vis, top, bot]);
    // los márgenes simulados se leen con la sonda de safeArea: se sustituye env() por variables
    await p.route('**/src/util/safeArea.js', (r) => r.fulfill({ contentType: 'text/javascript', body: `export function safeArea(){return {top:${top},bottom:${bot},left:0,right:0};}` }));
    await p.goto('http://localhost:8123/'); await p.waitForTimeout(800);
    await p.click('button[data-mode=marathon]'); await p.waitForTimeout(2600);
    const r = await p.evaluate(() => { const q = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; };
      return { top: q('.topbar'), board: q('#board'), hold: q('.hold-box'), next: q('.next-box'), touch: q('#touch'), sw: document.documentElement.scrollWidth }; });
    const vis_ = (a) => a[1] >= -1 && a[3] <= vis + 1 && a[0] >= -1 && a[2] <= w + 1;
    const ok = ['top', 'board', 'hold', 'next', 'touch'].every((k) => vis_(r[k])) && r.sw <= w;
    if (!ok) fail++;
    if (!ok) console.log('FALLO', w, full, vis, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
  console.log(fail ? `${fail} tamaños fallidos` : `Todo visible en ${CASES.length} tamaños`);
  process.exit(fail ? 1 : 0);
})();
