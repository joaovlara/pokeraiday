export function calculateHp(base: number, level: number, iv: number = 31, ev: number = 0): number {
  return Math.floor(((2 * base + iv + ev / 4) * level) / 100) + level + 10;
}

export function calculateStat(base: number, level: number, iv: number = 31, ev: number = 0): number {
  return Math.floor(((2 * base + iv + ev / 4) * level) / 100) + 5;
}
