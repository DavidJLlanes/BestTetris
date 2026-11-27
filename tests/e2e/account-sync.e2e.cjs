/**
 * Prueba de navegador (no entra en `npm test`): dos dispositivos con progreso distinto inician sesión
 * en la misma cuenta y los dos acaban con todo (récords juntos, máximos, logros de ambos), sin perder nada.
 * Uso: servir el juego CON PHP en :8123 (php -S localhost:8123 en la carpeta del juego, con
 * BESTTRIS_DATA apuntando a una carpeta de pruebas), crear el usuario
 * `prueba` / `prueba1234` con server/cli/crear-usuario.php y `node tests/e2e/account-sync.e2e.cjs [carpeta-capturas]`.
 */
const { chromium } = require('playwright');
const SHOTS = process.argv[2];
const URL = 'http://localhost:8123/';
const rec = (value) => ({ value, score: value, lines: 10, level: 2, time: 60, date: '1/11/2026' });
const SEED_A = { identity: { name: 'Ana', photo: null }, profile: { games: 5, lines: 40 }, records: { marathon: [rec(900)] }, achievements: { first: '1/11/2026' } };
const SEED_B = { profile: { games: 2, lines: 70 }, records: { marathon: [rec(300)] }, achievements: { lines10: '2/11/2026' } };

async function device(b, seed, size) {
  const ctx = await b.newContext({ viewport: size });
  await ctx.addInitScript((s) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    for (const [k, v] of Object.entries(s)) localStorage.setItem(`prisma.${k}`, JSON.stringify(v));
  }, seed);
  const p = await ctx.newPage();
  await p.goto(URL); await p.waitForTimeout(1200);
  return { ctx, p };
}

async function login(p) {
  await p.evaluate(() => document.querySelector('[data-open="ov-profile"]').click());
  await p.waitForTimeout(500);
  await p.fill('#account-user', 'Prueba'); await p.fill('#account-pass', 'prueba1234');
  await p.click('#account-login');
  await p.waitForTimeout(2500); // fusión y recarga
}

const read = (p) => p.evaluate(() => Object.fromEntries(['profile', 'records', 'achievements', 'identity', 'sync'].map((k) => [k, JSON.parse(localStorage.getItem(`prisma.${k}`) || 'null')])));

(async () => {
  const b = await chromium.launch();
  const bad = [];
  const A = await device(b, SEED_A, { width: 1280, height: 800 });
  await login(A.p);
  if (SHOTS) { await A.p.evaluate(() => document.querySelector('[data-open="ov-profile"]').click()); await A.p.waitForTimeout(600); await A.p.locator('#account').screenshot({ path: `${SHOTS}/cuenta-conectada.png` }); }
  const B = await device(b, SEED_B, { width: 440, height: 733 });
  await login(B.p);
  const sb = await read(B.p);
  await A.p.reload(); await A.p.waitForTimeout(1500); // el arranque trae lo nuevo
  const sa = await read(A.p);
  for (const [who, s] of [['A', sa], ['B', sb]]) {
    if (!s.sync || s.sync.user !== 'prueba') bad.push(`${who}: sin sesión`);
    if (s.profile.games !== 5 || s.profile.lines !== 70) bad.push(`${who}: estadísticas mal fusionadas ${JSON.stringify(s.profile)}`);
    if (JSON.stringify(s.records.marathon.map((e) => e.value)) !== '[900,300]') bad.push(`${who}: récords ${JSON.stringify(s.records)}`);
    if (!s.achievements.first || !s.achievements.lines10) bad.push(`${who}: logros ${JSON.stringify(s.achievements)}`);
    if (!s.identity || s.identity.name !== 'Ana') bad.push(`${who}: nombre ${JSON.stringify(s.identity)}`);
  }
  const cookie = (await A.ctx.cookies()).find((c) => c.name === 'besttris_sesion');
  if (!cookie || !cookie.httpOnly || cookie.sameSite !== 'Strict') bad.push(`cookie insegura ${JSON.stringify(cookie)}`);
  if (await A.p.evaluate(() => document.cookie.includes('besttris'))) bad.push('la cookie se ve desde JavaScript');
  // Cerrar sesión deja el progreso en el dispositivo
  await A.p.evaluate(() => document.querySelector('[data-open="ov-profile"]').click()); await A.p.waitForTimeout(400);
  await A.p.click('#account-logout'); await A.p.waitForTimeout(800);
  const out = await read(A.p);
  if (out.sync.user) bad.push('no se cerró la sesión');
  if (out.profile.games !== 5) bad.push('al cerrar sesión se perdió progreso');
  await b.close();
  if (bad.length) { console.error('FALLOS:\n' + bad.join('\n')); process.exit(1); }
  console.log('Sincronización entre dispositivos correcta');
})();
