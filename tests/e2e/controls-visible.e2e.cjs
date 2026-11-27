/**
 * Prueba de navegador (no entra en `npm test`): en plena partida, con la barra del navegador
 * cambiando de tamaño y con la página desplazada, la barra superior, el tablero y los botones
 * táctiles deben verse enteros. Uso: servir el juego en :8123 y `node tests/e2e/controls-visible.e2e.cjs`.
 * Necesita Playwright instalado.
 */
const { chromium, devices } = require('playwright');

const IOS = devices['iPhone 13'].userAgent;
const PHONES = [[440, 734, 956], [393, 659, 852], [375, 553, 667], [320, 568, 658], [820, 1080, 1180]];
const inside = (r, h) => r && r.top >= -1 && r.bottom <= h + 1 && r.height > 0;

(async () => {
  const b = await chromium.launch();
  let failed = 0;
  for (const [w, h, tall] of PHONES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, userAgent: IOS });
    const p = await ctx.newPage();
    await p.goto('http://localhost:8123/');
    await p.waitForTimeout(700);
    await p.click('button[data-mode=marathon]');
    await p.waitForTimeout(2600);
    // Safari esconde y enseña su barra, y la página se desplaza
    for (const vh of [tall, h, tall - 40, h]) {
      await p.setViewportSize({ width: w, height: vh });
      await p.evaluate(() => { document.documentElement.scrollTop = 60; scrollTo(0, 60); });
      await p.waitForTimeout(900);
      const r = await p.evaluate(() => {
        const rect = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, height: b.height }; };
        return { vh: innerHeight, top: rect('.topbar'), board: rect('#board'), touch: rect('.touch'), screen: __prisma.app.screen };
      });
      const ok = inside(r.top, r.vh) && inside(r.board, r.vh) && inside(r.touch, r.vh) && r.screen === 'play';
      if (!ok) { failed++; console.log('FALLO', w, vh, JSON.stringify(r)); }
    }
    await ctx.close();
  }
  await b.close();
  console.log(failed ? `${failed} comprobaciones fallidas` : 'Controles visibles en todos los tamaños');
  process.exit(failed ? 1 : 0);
})();
