import { DEFAULT_SETTINGS } from '../config/defaults.js';
import { load, save } from './store.js';

export function loadSettings() { return { ...DEFAULT_SETTINGS, ...load('settings', {}) }; }
export function saveSettings(settings) { save('settings', settings); }
