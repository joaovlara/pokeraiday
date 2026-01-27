import { PokemonEntity } from "../entities/pokemon";

export interface RoundResult {
  log: string[];
  bossHp: number;
  teamHp: Record<string, number>;
}

export function executeRound(team: PokemonEntity[], boss: PokemonEntity): RoundResult {
  const log: string[] = [];

  // Cada Pokémon ataca uma vez
  team.forEach(p => {
    if (p.hp > 0) {
      const damage = Math.floor(p.stats.attack / 2);
      boss.hp -= damage;
      log.push(`${p.name} atacou causando ${damage} de dano!`);
    }
  });

  // Boss ataca 2 vezes
  for (let i = 0; i < 2; i++) {
    const target = team[Math.floor(Math.random() * team.length)];
    if (target.hp > 0) {
      const damage = Math.floor(boss.stats.attack / 2);
      target.hp -= damage;
      log.push(`Boss atacou ${target.name} causando ${damage} de dano!`);
    }
  }

  return {
    log,
    bossHp: boss.hp,
    teamHp: Object.fromEntries(team.map(p => [p.name, p.hp])),
  };
}
