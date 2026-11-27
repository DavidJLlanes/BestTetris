import { spawnScenePiece } from './spawnScenePiece.js';

/** Avanza la escena: caída, giro, disolución al llegar abajo y relevo por arriba. */
export function stepScene(s, dt, count) {
  while (s.pieces.length < count) s.pieces.push(spawnScenePiece(s.w, s.h, s.pieces.length > 0 && s.started));
  if (s.pieces.length > count) s.pieces.length = count;
  s.started = true;
  for (let i = 0; i < s.pieces.length; i++) {
    const p = s.pieces[i];
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    if (p.y > p.end) p.fade = Math.max(0, p.fade - dt * 0.9);
    if (p.fade <= 0) s.pieces[i] = spawnScenePiece(s.w, s.h, true);
  }
  s.pieces.sort((a, b) => a.z - b.z); // las lejanas primero
}
