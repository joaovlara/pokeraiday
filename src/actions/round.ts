import { PokemonEntity, Attack } from "../entities/pokemon.entity";
import { calculateDamage } from "@/utils/damage";

export interface RoundResult {
  log: string[];
  bossHp: number;
  teamHp: Record<string, number>;
}

export function executeRound(team: PokemonEntity[], boss: PokemonEntity): RoundResult {
  const log: string[] = [];

  // Cada Pokémon ataca uma vez
  team.forEach(p => {
    if (p.hp > 0 && p.moves.length > 0) {
      const move = p.moves[Math.floor(Math.random() * p.moves.length)];
      const damage = calculateDamage(p, boss, move);
      boss.hp -= damage;
      log.push(`${p.name} usou ${move.name} causando ${damage} de dano no Boss!`);
    }
  });

  // Boss ataca 2 vezes
  for (let i = 0; i < 2; i++) {
    const target = team[Math.floor(Math.random() * team.length)];
    if (target.hp > 0 && boss.moves.length > 0) {
      const move = boss.moves[Math.floor(Math.random() * boss.moves.length)];
      const damage = calculateDamage(boss, target, move);
      target.hp -= damage;
      log.push(`Boss usou ${move.name} em ${target.name} causando ${damage} de dano!`);
    }
  }

  return {
    log,
    bossHp: boss.hp,
    teamHp: Object.fromEntries(team.map(p => [p.name, p.hp])),
  };
}
