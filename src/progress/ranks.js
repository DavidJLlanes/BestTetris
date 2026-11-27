/** Rangos del jugador según su nivel. Cada uno tiene su color de anillo. */
export const RANKS = [
  { min: 1, name: 'Chispa', color: '#9aa3c7' },
  { min: 5, name: 'Cristal', color: '#8fd3ff' },
  { min: 10, name: 'Gema', color: '#5cff9d' },
  { min: 18, name: 'Prisma', color: '#c07bff' },
  { min: 28, name: 'Aurora', color: '#46e6ff' },
  { min: 40, name: 'Nova', color: '#ffd34f' },
  { min: 60, name: 'Leyenda', color: '#ff4fd8' },
];

export function rankFor(level) {
  let r = RANKS[0];
  for (const x of RANKS) if (level >= x.min) r = x;
  return r;
}
