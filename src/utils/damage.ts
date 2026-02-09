import { PokemonEntity, Attack } from "@/entities/pokemon.entity";
import { BossEntity } from "@/entities/boss.entity";
import { getTypeEffectiveness } from "@/utils/typeChart";

/**
 * Fórmula simplificada de dano:
 * base = (((2 * level / 5) + 2) * power * atk / def) / 50 + 2
 * damage = max(1, floor(base * r)), onde r ∈ [0.85, 1.0]
 */

export function calculateDamage(
  attacker: PokemonEntity | BossEntity,
  defender: PokemonEntity | BossEntity,
  move: Attack
): number {
  const level = attacker.level;
  const power = move.power ?? 50;

  const atk = attacker.stats.attack ?? 50;
  const def = defender.stats.defense ?? 50;

  // Fórmula base
  const base =
    (((2 * level) / 5 + 2) * power * atk) / def / 50 + 2;

  // Fator aleatório
  const randomFactor = 0.85 + Math.random() * 0.15;

  // Efetividade de tipos
  const typeMultiplier = getTypeEffectiveness(move.type, defender.types);

  const damage = Math.floor(base * randomFactor * typeMultiplier);

  return Math.max(1, damage);
}
