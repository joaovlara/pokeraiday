import { Pokemon, Move } from "@/types/pokemon";

export function getStat(pokemon: Pokemon, stat: string): number {
  return pokemon.stats.find((s) => s.stat.name === stat)?.base_stat || 0;
}

export function pickRandomMoves(pokemon: Pokemon, count = 4): Move[] {
  const unique = Array.from(new Set(pokemon.moves.map((m) => m.move)));
  const shuffled = unique.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function calculateDamage(
  basePower: number,
  attack: number,
  defense: number,
): number {
  const baseDamage = Math.max(1, Math.floor((basePower * attack) / (defense + 20)));
  const randomFactor = Math.floor(Math.random() * Math.max(1, Math.floor(baseDamage * 0.25)));
  return baseDamage + randomFactor;
}

export function getHPBarColor(hpPercent: number): string {
  if (hpPercent > 50) return "bg-green-500";
  if (hpPercent > 20) return "bg-yellow-400";
  return "bg-red-500";
}
