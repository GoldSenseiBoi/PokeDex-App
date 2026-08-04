export type StatMode = 'min' | 'base' | 'max';

// Standard level-100 stat range formulas (min = 0 IV / 0 EV / hindering nature, max = 31 IV / 252 EV / beneficial nature).
export function getStatValue(base: number, statKey: string, mode: StatMode, level = 100): number {
  if (mode === 'base') return base;

  const isHp = statKey === 'hp';
  const iv = mode === 'max' ? 31 : 0;
  const ev = mode === 'max' ? 252 : 0;
  const nature = mode === 'max' ? 1.1 : 0.9;

  const core = Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100);

  if (isHp) return core + level + 10;
  return Math.floor((core + 5) * nature);
}
