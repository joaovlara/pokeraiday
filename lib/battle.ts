import { Pokemon } from "@/types/pokemon";

export function getStat(pokemon: Pokemon, stat: string): number {
  return pokemon.stats.find((s) => s.stat.name === stat)?.base_stat || 0;
}

export function calculateDamage(attacker: Pokemon, defender: Pokemon): number {
  const attack = getStat(attacker, "attack");
  const defense = getStat(defender, "defense");
  return Math.max(1, attack - defense);
}

export function performAttack(
  defenderHp: number,
  damage: number
): { newHp: number; isDefeated: boolean } {
  const newHp = Math.max(0, defenderHp - damage);
  return { newHp, isDefeated: newHp === 0 };
}

export function getStatPercentage(current: number, max: number): number {
  return (current / max) * 100;
}

export function getTypeColor(hp: number, maxHp: number): string {
  const percentage = (hp / maxHp) * 100;
  if (percentage > 50) return "bg-green-400";
  if (percentage > 25) return "bg-yellow-400";
  return "bg-red-400";
}
