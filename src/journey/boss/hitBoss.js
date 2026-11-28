const DAMAGE = [0, 1, 3, 5, 8]; // vida que quita limpiar 1, 2, 3 o 4 líneas de golpe

/** Las líneas golpean al jefe: más líneas de golpe, más daño; un combo suma. */
export function hitBoss(g, lines) {
  const b = g.custom.boss;
  if (!b || !lines || b.hp <= 0) return;
  const dmg = DAMAGE[Math.min(4, lines)] + Math.max(0, Math.min(3, g.combo));
  b.hp = Math.max(0, b.hp - dmg);
  b.flash = 1;
  g.emit('bossHit', { dmg, hp: b.hp, max: b.max });
}
