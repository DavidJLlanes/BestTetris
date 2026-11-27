import { mergeProfile } from './rules/mergeProfile.js';
import { mergeRecords } from './rules/mergeRecords.js';
import { mergeReplays } from './rules/mergeReplays.js';
import { mergeHistory } from './rules/mergeHistory.js';
import { mergeUnion } from './rules/mergeUnion.js';
import { mergeDays } from './rules/mergeDays.js';
import { mergeSettings } from './rules/mergeSettings.js';
import { newest } from './rules/newest.js';
import { keepLocal } from './rules/keepLocal.js';
import { either } from './rules/either.js';

/** Cómo se fusiona cada clave del guardado. Una clave nueva en SAVE_KEYS necesita su regla aquí (lo vigila una prueba). */
export const RULES = {
  identity: newest,
  settings: mergeSettings,
  records: mergeRecords,
  profile: mergeProfile,
  achievements: mergeUnion,
  muted: keepLocal, // el sonido es cosa de cada dispositivo
  tutorialDone: either,
  replays: mergeReplays,
  days: mergeDays,
  history: mergeHistory,
  editorDraft: newest,
};
