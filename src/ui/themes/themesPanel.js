import { $ } from '../../util/dom.js';
import { app } from '../../app/state.js';
import { onOpen } from '../overlays.js';
import { saveSettings } from '../../storage/settings.js';
import { getProfile } from '../../storage/profile.js';
import { levelFromXp } from '../../progress/levels.js';
import { THEMES, isUnlocked } from '../../progress/themes.js';
import { playSfx } from '../../audio/index.js';
import { themeSwatch } from './themeSwatch.js';
import { applyTheme } from './applyTheme.js';

function render() {
  const level = levelFromXp(getProfile().xp).level, s = app.settings;
  $('themes').innerHTML = Object.entries(THEMES).map(([kind, group]) => `
    <section><h3>${group.title}</h3><div class="theme-grid">${group.list.map((t) => {
      const open = isUnlocked(t, level), on = s[group.setting] === t.id;
      return `<button class="theme ${on ? 'on' : ''}" data-kind="${kind}" data-id="${t.id}" ${open ? '' : 'disabled'} aria-pressed="${on}">
        ${themeSwatch(kind, t)}<b>${t.name}</b><small>${open ? (on ? 'En uso' : 'Elegir') : `🔒 Nivel ${t.level}`}</small></button>`;
    }).join('')}</div></section>`).join('');
}

/** Pantalla de temas: gemas, fondos y música que se desbloquean por nivel. */
export function bindThemesPanel() {
  onOpen('ov-themes', render);
  $('themes').addEventListener('click', (e) => {
    const b = e.target.closest('button.theme');
    if (!b || b.disabled) return;
    app.settings[THEMES[b.dataset.kind].setting] = b.dataset.id;
    applyTheme(app.settings);
    saveSettings(app.settings);
    playSfx('rotate');
    render();
  });
}
