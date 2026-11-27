/**
 * Iconos propios de cada modo (trazos de 24×24, sin emojis). Se pintan con currentColor y el
 * degradado de la tarjeta les da su color y su luz.
 */
const S = (d) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`;
const F = (d, o = 1) => `<path d="${d}" fill="currentColor" opacity="${o}"/>`;

export const MODE_ICONS = {
  tutorial: S('M6 3l12 9-5.5 1.2L15.5 20l-2.6 1.2-3-6.6L6 18z'),
  marathon: S('M12 12c-2-2.6-3.6-4-5.5-4a4 4 0 0 0 0 8c1.9 0 3.5-1.4 5.5-4zm0 0c2 2.6 3.6 4 5.5 4a4 4 0 0 0 0-8c-1.9 0-3.5 1.4-5.5 4z'),
  journey: S('M4 19c3.5 0 3.5-6 8-6s4.5-7 8-7') + F('M4 19m-2.2 0a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0M12 13m-1.8 0a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M20 6m-2.2 0a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0-4.4 0'),
  sprint: S('M12 21a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15zM12 13.5V9.5M9.5 2.5h5M18.5 6.5l1.5-1.5'),
  ultra: F('M13.5 2 4.5 13.5h6.5L9.8 22l9.7-12.3h-6.6z'),
  dig: S('M3.5 9.5C8 4.5 16 4.5 20.5 9.5M12 6.2 6.5 21'),
  tide: S('M2.5 9c2.4-2.4 4.8-2.4 7.2 0s4.8 2.4 7.2 0 3.6-1.6 4.6-.8M2.5 15c2.4-2.4 4.8-2.4 7.2 0s4.8 2.4 7.2 0 3.6-1.6 4.6-.8'),
  master: S('M4 18.5h16M4.5 16 3 7l5 4 4-7 4 7 5-4-1.5 9z'),
  shadow: S('M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z') + F('M12 4a8 8 0 0 0 0 16z', 0.85),
  purist: S('M12 2.5 20.5 12 12 21.5 3.5 12zM12 7.5 16 12l-4 4.5L8 12z'),
  daily: S('M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6'),
  zen: S('M18.5 7A8 8 0 1 0 20 13.2'),
  drift: S('M19.5 14.5A8 8 0 1 1 9.5 4.5a6.4 6.4 0 0 0 10 10z') + F('M17 4.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z'),
  seasons: S('M5 19C5 10 11 5 20 4c-1 9-6 15-15 15zM5 19l8-8'),
  sway: S('M3 13c3-4 6-4 9 0s6 4 9 0M7 19h10M12 3v6'),
  chaos: S('M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8') + F('M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'),
  powers: F('M12 2.5c1 5.3 3.7 8 9 9-5.3 1-8 3.7-9 9-1-5.3-3.7-8-9-9 5.3-1 8-3.7 9-9z'),
  puzzles: S('M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4z') + F('M13 13h7v7h-7z', 0.35),
};

export const modeIcon = (id) => `<svg viewBox="0 0 24 24" aria-hidden="true">${MODE_ICONS[id] || S('M5 5h14v14H5z')}</svg>`;
