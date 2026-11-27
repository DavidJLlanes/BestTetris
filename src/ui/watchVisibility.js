import { app } from '../app/state.js';
import { pause } from '../app/pause.js';
import { releaseAll } from '../input/state.js';
import { saveProfile } from '../storage/profile.js';

/** Al cambiar de pestaña o de app, la partida se pausa y se guarda el progreso. */
export function watchVisibility() {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    saveProfile();
    if (app.screen === 'play') pause();
  });
  addEventListener('blur', () => { releaseAll(); if (app.game) app.game.softDrop = false; });
  addEventListener('pagehide', saveProfile);
}
