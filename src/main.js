/**
 * BestTris · arranque. Conecta los módulos en orden; ninguno depende de este archivo.
 */
import { $ } from './util/dom.js';
import { app } from './app/state.js';
import { load } from './storage/store.js';
import { setMuted, unlockAudio } from './audio/index.js';
import { attachCanvases } from './render/view.js';
import { watchViewport } from './ui/watchViewport.js';
import { watchVisibility } from './ui/watchVisibility.js';
import { startMenuScene } from './menuScene/index.js';
import { startLogo3d } from './logo3d/index.js';
import { bindHud } from './ui/hud.js';
import { bindUndoButton } from './ui/undoButton.js';
import { blockZoom } from './ui/blockZoom.js';
import { bindRaceHud } from './ui/raceHud.js';
import { bindPowerButton } from './ui/powerButton.js';
import { bindStarButton } from './ui/starButton.js';
import { bindLevelBadge } from './ui/levelBadge.js';
import { bindReplayButtons } from './ui/replayButtons.js';
import { watchReplay } from './replay/watchReplay.js';
import { watchSpectate } from './replay/watchSpectate.js';
import { bindButtons } from './ui/bindButtons.js';
import { bindModeMenu } from './ui/modeMenu.js';
import { bindSettingsPanel } from './ui/settingsPanel.js';
import { bindRecordsPanel } from './ui/recordsPanel.js';
import { bindTrophiesPanel } from './ui/trophiesPanel.js';
import { bindProfilePanel } from './ui/profilePanel.js';
import { bindSharePanel } from './ui/sharePanel.js';
import { refreshIdentityBadge } from './ui/identityBadge.js';
import { showOverlay } from './ui/overlays.js';
import { bindKeyboard } from './input/keyboard.js';
import { bindTouchButtons } from './input/touchButtons.js';
import { bindTouchGestures } from './input/touchGestures.js';
import { watchConnection } from './input/gamepad/watchConnection.js';
import { trackProfile } from './achievements/trackProfile.js';
import { watchAchievements } from './achievements/watchAchievements.js';
import { trackProgress } from './progress/trackProgress.js';
import { watchFinish } from './app/onFinish.js';
import { wireReactions } from './app/reactions/index.js';
import { startLoop } from './app/loop.js';
import { perf } from './app/perf.js';
import { press, release } from './input/press.js';
import { watchTutorial } from './tutorial/watchTutorial.js';
import { watchPuzzles } from './puzzles/app/watchPuzzles.js';
import { bindPuzzlesPanel } from './ui/puzzles/puzzlesPanel.js';
import { bindCodePanel, openSharedPuzzle } from './ui/puzzles/codePanel.js';
import { bindEditorPanel } from './ui/editor/editorPanel.js';
import { bindProfileProgress } from './ui/progress/profileProgress.js';
import { bindStatsPanel } from './ui/progress/statsPanel.js';
import { bindThemesPanel } from './ui/themes/themesPanel.js';
import { bindChallengeButton } from './ui/challenge/challengeButton.js';
import { bindVersusPanel } from './ui/versus/versusPanel.js';
import { bindDecorSettings } from './ui/decorSettings.js';
import { initDecor } from './decor/index.js';
import { showDiagnostics } from './ui/diagnostics.js';
import { bindSidePanels } from './ui/sidePanels.js';
import { openSharedChallenge } from './ui/challenge/openSharedChallenge.js';
import { registerServiceWorker } from './pwa/registerServiceWorker.js';
import { bindInstallPrompt } from './pwa/installPrompt.js';

const canvases = { board: $('board'), hold: $('hold'), next: $('next') };
attachCanvases(canvases);
watchViewport(canvases);
watchVisibility();
startMenuScene();
startLogo3d();
blockZoom();
unlockAudio();

trackProfile();       // primero: los logros leen el perfil ya actualizado
watchAchievements();
trackProgress();      // experiencia: después de los logros (cuentan los de esta partida)
watchReplay();        // antes de watchFinish: la grabación se cierra antes de decidir si es récord
watchFinish();
wireReactions();
watchTutorial();
watchPuzzles();       // después del tutorial, que oculta la pista al empezar
watchSpectate();

bindHud();
bindUndoButton();
bindRaceHud();
bindPowerButton();
bindStarButton();
bindReplayButtons();
bindButtons();
bindModeMenu();
bindSettingsPanel();
bindRecordsPanel();
bindTrophiesPanel();
bindProfilePanel();
bindSharePanel();
bindPuzzlesPanel();
bindCodePanel();
bindEditorPanel();
bindProfileProgress();
bindStatsPanel();
bindThemesPanel();
bindChallengeButton();
bindVersusPanel();
bindDecorSettings();
initDecor();
showDiagnostics();
bindSidePanels();
refreshIdentityBadge();
bindLevelBadge();

bindKeyboard();
bindTouchButtons($('game')); // botones de abajo y, en táctil, la caja de reserva
bindTouchGestures($('board-wrap'));
watchConnection();
bindInstallPrompt();
registerServiceWorker();
if (app.device.touch) app.lastInput = 'touch';

if (load('muted', false)) { setMuted(true); $('btn-mute').classList.add('off'); }
if (new URLSearchParams(location.search).has('fps')) perf.show();

showOverlay('ov-menu');
openSharedPuzzle();
openSharedChallenge();
startLoop();
document.body.classList.add('ready');

// Acceso para pruebas automatizadas y depuración.
window.__prisma = { app, perf, press, release };
