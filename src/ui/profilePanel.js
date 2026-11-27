import { $ } from '../util/dom.js';
import { loadIdentity, saveIdentity } from '../storage/identity.js';
import { exportSave } from '../storage/backup/exportSave.js';
import { importSave } from '../storage/backup/importSave.js';
import { resizeImage } from '../util/resizeImage.js';
import { getProfile } from '../storage/profile.js';
import { getUnlocked } from '../storage/achievements.js';
import { ACHIEVEMENTS } from '../achievements/registry.js';
import { formatNumber } from '../util/formatNumber.js';
import { onOpen } from './overlays.js';
import { paintAvatar, refreshIdentityBadge } from './identityBadge.js';

function status(text, ok = true) {
  const el = $('profile-status');
  el.textContent = text;
  el.className = `status ${ok ? 'ok' : 'error'}`;
}

function renderStats() {
  const p = getProfile();
  const got = Object.keys(getUnlocked()).length;
  const hours = (p.playTime / 3600).toFixed(1).replace('.', ',');
  $('profile-stats').innerHTML = [
    ['Partidas', formatNumber(p.games)], ['Líneas', formatNumber(p.lines)], ['Prismas', formatNumber(p.quads)],
    ['Horas', hours], ['Logros', `${got}/${ACHIEVEMENTS.length}`], ['Nivel máximo', p.maxLevel],
  ].map(([k, v]) => `<span>${k}</span><b>${v}</b>`).join('');
}

/** Perfil local: nombre, foto, estadísticas y copia de seguridad. Nada sale del dispositivo. */
export function bindProfilePanel() {
  const name = $('profile-name'), photoInput = $('profile-photo-input'), importInput = $('profile-import-input');
  const draw = () => { const id = loadIdentity(); name.value = id.name; paintAvatar($('profile-avatar'), id); };

  onOpen('ov-profile', () => { draw(); renderStats(); status(''); });
  name.addEventListener('change', () => { saveIdentity({ ...loadIdentity(), name: name.value }); refreshIdentityBadge(); draw(); status('Nombre guardado'); });
  $('profile-photo-btn').addEventListener('click', () => photoInput.click());
  $('profile-avatar').addEventListener('click', () => photoInput.click()); // tocar la foto también la cambia
  photoInput.addEventListener('change', async () => {
    const file = photoInput.files[0];
    photoInput.value = '';
    if (!file) return;
    try {
      const photo = await resizeImage(file);
      saveIdentity({ ...loadIdentity(), photo });
      refreshIdentityBadge(); draw();
      // Se comprueba que de verdad ha quedado guardada (modo privado o almacenamiento lleno)
      if (loadIdentity().photo === photo) status('Foto guardada en este dispositivo');
      else status('El navegador no ha dejado guardar la foto (¿modo privado?)', false);
    } catch { status('No se ha podido usar esa imagen', false); }
  });
  $('profile-photo-remove').addEventListener('click', () => { saveIdentity({ ...loadIdentity(), photo: null }); refreshIdentityBadge(); draw(); status('Foto quitada'); });
  $('profile-export').addEventListener('click', () => { exportSave(loadIdentity().name); status('Copia descargada'); });
  $('profile-import').addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', async () => {
    const file = importInput.files[0];
    importInput.value = '';
    if (!file) return;
    const r = await importSave(file);
    if (!r.ok) { status(r.error, false); return; }
    status('Progreso recuperado. Recargando…');
    setTimeout(() => location.reload(), 700);
  });
}
