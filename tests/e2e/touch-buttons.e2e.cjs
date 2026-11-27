/**
 * Prueba de navegador (no entra en `npm test`): en 440x733 pulsa con el dedo cada botón táctil
 * y comprueba que hace su acción, y que pulsar no borra el tablero (destello).
 * Uso: servir el juego en :8123 y `node tests/e2e/touch-buttons.e2e.cjs`. Necesita Playwright.
 */
const { chromium, devices } = require('playwright');
(async () => {
  const b = await chromium.launch(); let fail = 0;
  const p = await (await b.newContext({ viewport: { width: 440, height: 733 }, screen: { width: 440, height: 956 }, isMobile: true, hasTouch: true, userAgent: devices['iPhone 13'].userAgent })).newPage();
  await p.goto('http://localhost:8123/'); await p.waitForTimeout(800);
  await p.click('button[data-mode=marathon]'); await p.waitForTimeout(2600);
  await p.evaluate(() => { const c = document.getElementById('board'); window.__clears = 0; const d = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'width'); Object.defineProperty(c, 'width', { get() { return d.get.call(this); }, set(v) { window.__clears++; d.set.call(this, v); } }); });
  const st = () => p.evaluate(async () => { const { app } = await import('/src/app/state.js'); const g = app.game; return { t: g.cur.type, x: g.cur.x, y: g.cur.y, r: g.cur.rot, hold: g.hold }; });
  const checks = {
    left: (a, z) => z.x === a.x - 1, right: (a, z) => z.x === a.x + 1, soft: (a, z) => z.y > a.y,
    hold: (a, z) => z.hold === a.t, cw: (a, z) => z.r !== a.r || z.t === 'O', ccw: (a, z) => z.r !== a.r || z.t === 'O', hard: (a, z) => z.t !== a.t || z.y < a.y,
  };
  for (const act of ['left', 'right', 'soft', 'hold', 'cw', 'ccw', 'hard']) {
    const box = await p.locator(`#touch [data-act=${act}]`).boundingBox();
    const a = await st();
    await p.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2); await p.waitForTimeout(60);
    const z = await st();
    if (!checks[act](a, z)) { fail++; console.log('FALLO', act, JSON.stringify(a), JSON.stringify(z)); }
  }
  const clears = await p.evaluate(() => window.__clears);
  if (clears) { fail++; console.log('FALLO: el tablero se ha redimensionado (y borrado) al pulsar', clears, 'veces'); }
  await b.close();
  console.log(fail ? `${fail} fallos` : 'Los 7 botones táctiles responden y el tablero no parpadea');
  process.exit(fail ? 1 : 0);
})();
